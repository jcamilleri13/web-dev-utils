import { request as githubRequest } from '@octokit/request'
import { subMonths } from 'date-fns'
import { Issue } from '../types'

interface GitHubDetails {
  repositoryName: string
  repositoryOwner: string
  accessToken?: string
}

export async function getGithubIssues(
  request: Request,
  { repositoryName, repositoryOwner, accessToken }: GitHubDetails,
) {
  if (request.method !== 'GET') {
    return new Response(null, { status: 400 })
  }

  const token = accessToken ?? process.env.GITHUB_ACCESS_TOKEN

  if (!token) {
    return new Response(null, { status: 401 })
  }

  try {
    const issues = await githubRequest('GET /repos/{owner}/{repo}/issues', {
      headers: {
        authorization: `token ${token}`,
      },
      repo: repositoryName,
      owner: repositoryOwner,
      state: 'all',
      labels: 'client dashboard',
      sort: 'created',
    })

    const threeMonthsAgo = subMonths(new Date(), 3).toISOString()
    const filteredIssues: Issue[] = issues.data
      .filter((issue) => issue.state === 'open' || issue.closed_at?.localeCompare(threeMonthsAgo))
      .map(({ closed_at, created_at, id, labels, state, title }) => ({
        closed_at,
        created_at,
        id,
        labels: labels
          .map((label) => (typeof label === 'string' ? label : label?.name))
          .filter((label): label is string => !!label),
        state: state as 'open' | 'closed',
        title,
      }))

    return new Response(JSON.stringify(filteredIssues))
  } catch (e) {
    console.error('Error retrieving GitHub issues:', e)
    return new Response(`Error retrieving GitHub issues for repository ${repositoryName}`, {
      status: 500,
    })
  }
}
