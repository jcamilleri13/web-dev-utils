import { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { request } from '@octokit/request'
import { subMonths } from 'date-fns'
import { Issue } from '../types'

const { GITHUB_ACCESS_TOKEN } = process.env

export async function getGithubIssues(
  event: HandlerEvent,
  repositoryName: string,
  repositoryOwner: string,
): Promise<HandlerResponse> {
  const headers = getCorsHeaders(event)

  if (event.httpMethod !== 'GET')
    return {
      headers,
      statusCode: 400,
    }

  try {
    const issues = await request('GET /repos/{owner}/{repo}/issues', {
      headers: {
        authorization: `token ${GITHUB_ACCESS_TOKEN}`,
      },
      repo: repositoryName,
      owner: repositoryOwner,
      state: 'all',
      labels: 'public',
      sort: 'created',
    })

    const threeMonthsAgo = subMonths(new Date(), 3).toISOString()
    const filteredIssues: Issue[] = issues.data
      .filter(
        (issue) =>
          issue.state === 'open' ||
          issue.closed_at?.localeCompare(threeMonthsAgo),
      )
      .map(({ closed_at, created_at, id, labels, state, title }) => ({
        closedAt: closed_at,
        created_at,
        dateCreated: created_at,
        id,
        labels: labels
          .map((label) => (typeof label === 'string' ? label : label?.name))
          .filter((label): label is string => !!label),
        state: state as 'open' | 'closed',
        title,
      }))

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(filteredIssues),
    }
  } catch (e) {
    console.error('Error retrieving GitHub issues:', e)
    return {
      headers,
      statusCode: 500,
      body: `Error retrieving GitHub issues for repository ${repositoryName}`,
    }
  }
}

function getCorsHeaders(event: HandlerEvent) {
  const { origin } = event.headers

  if (!origin) {
    throw new Error(`Missing origin headers`)
  }

  const originAllowed = event.rawUrl.includes(origin)
  if (originAllowed) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': '*',
    }
  }

  throw new Error(`Origin "${origin}" forbidden`)
}
