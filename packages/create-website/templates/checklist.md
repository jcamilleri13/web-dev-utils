# Development Checklist

## Pre-dev

- [ ] Create client Netlify account.

## Typography

- [ ] Select a base font, and optionally a heading font.
- [ ] Add font assets to project (or link via Adobe fonts or whatever).
  - [ ] Subset and compress physical font assets. [^font-subsetting]
- [ ] Configure the base font-size and line-height.
- [ ] Select a typographic ratio based on the selected font.
- [ ] Configure text style, headings, and `em`/`strong` tag styles.
- [ ] Design link styles. (Link, visited, hover, active, and focus.)

## Prototyping

- [ ] Create basic page structures using prototyping components.

## Transitions

- [ ] Wrap page element in `Transition` elements.
- [ ] Fine-tune transition types and timing.

## Logo

- [ ] Add logo to assets (SVG, ideally) and enable in header.
- [ ] ... Favicon instructions here.

## Styling

## Contact forms

- [ ] Set up a new MailJet account. (https://www.mailjet.com/)
- [ ] Generate an API key and secret and add to env variables.

# Domains & DNS

- [ ] Configure DNS records to point to Netlify.
- [ ] Verify configuration and requisition SSL certificates.

# Sanity configuration

- [ ] Copy Sanity API key from .env file to Netlify environment variables.
- [ ] Add CORS origins to Sanity settings.
- [ ] Add the "http://sveltekit-prerender" origin to Sanity for SvelteKit pre-rendering.
- [ ] Add `netlify-build` hook to Sanity.io dashboard. (Get url from Netlify dashboard.)

# Image optimisation

- [ ] Create Cloudinary account.
- [ ] Construct cloudinary URL (see .env file) and add to Netlify environment variables.
- [ ] Add `optimise-images` hook to Sanity.io dashboard: `https://manage.(client).mt/.netlify/functions/optimise-images`. Webhook should be configured to trigger on "Create" with a filter of `_type == "sanity.imageAsset"`.

## Wrapping up

- [ ] Search for TODO comments and patch up.

[^font-subsetting]
Install python FontTools and Brotli via pip: `pip install fonttools brotli`.

The following command will subset the Latin and Extended Latin character sets (includes Maltese):

```
pyftsubset font.woff2
  --unicodes="0020-007F,00A0-00FF,0100-017F"
  --layout-features="*"
  --flavor="woff2"
  --with-zopfli
```

# General Development Notes

1. Design the little things. Little interactions, styles, animations...
2. Is it accessible?
3. Test on mobile & small screens.
