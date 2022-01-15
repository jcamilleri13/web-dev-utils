# Web Dev Utils #
A collection of packages, tools, and templates to speed up web development.

## create-website ##
Interactive NPM initialiser for creating SvelteKit (with optional Sanity back-end) project, as well as optionally creating corresponding GitHub and Netlify projects.

`npm init @james-camilleri/website my-website-folder`

## replace-sanity-favicon ##
Super simple script to insert custom favicon on self-hosted sanity builds. Integrated with `create-website` template.

## sanity-web-image ##
A Sanity.io-based responsive image pipeline with additional Svelte component. Consists of:

### Webhooks
A pair of webhooks which can optimise SVGs via SVGO and generate optimised  breakpoints for raster images via Cloudinary's responsive breakpoint service. The updated SVGs or additional image metadata are automatically inserted into Sanity.io.

### Prefetch Tool
A utility for prefetching all image data from a complex Sanity document. Useful for server-side rendering pages with responsive image breakpoint data.
### Svelte component
A Svelte component to create responsive `img` tags with `sizes` attributes attuned to the generated breakpoints of your Saniy images.

## slack-logger ##
Logs errors to a slack hook. No biggie, but handy to know if a client's system is blowing up under the hood somewhere. Can be configured to only alert at certain log levels.
