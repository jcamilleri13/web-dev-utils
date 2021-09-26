import { onImageUploadHook } from '@jcamilleri/sanity-web-image'
import { Handler } from '@netlify/functions'
import sanityClient from '@sanity/client'

const { SANITY_API_KEY } = process.env

const client = sanityClient({
  projectId: '',
  apiVersion: '',
  dataset: 'production',
  token: SANITY_API_KEY,
  useCdn: false
})

export const handler: Handler = async event => onImageUploadHook(client, event)
