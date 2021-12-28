import { optimiseAllImages } from '@james-camilleri/sanity-web-image'
import sanityClient from '@sanity/client'
import { v2 as cloudinary } from 'cloudinary'

const CONFIG = {
  DOMAIN: '',
  UPDATE_FUNCTION: 'update-image-metadata',
  CLOUDINARY: {
    cloud_name: '',
    api_key: '',
    api_secret: ''
  },
  SANITY: {
    projectId: '',
    dataset: 'production',
    apiVersion: '',
    token: '',
    useCdn: false
  }
}

cloudinary.config(CONFIG.CLOUDINARY)
const client = sanityClient(CONFIG.SANITY)

async function optimise() {
  await optimiseAllImages(
    client,
    `https://${CONFIG.DOMAIN}/.netlify/functions/-`,
    CONFIG.UPDATE_FUNCTION
  )
}

optimise()
