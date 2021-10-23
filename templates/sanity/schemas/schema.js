import { WebImageSchema as WebImage } from '@jcamilleri13/sanity-web-image'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import createSchema from 'part:@sanity/base/schema-creator'

import FormContact from './forms/contact'
import PagePlaceholder from './pages/placeholder'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    FormContact,
    PagePlaceholder,
    WebImage
  ])
})
