# e-Potek www v2

Our brand website is built on the following stack:

- Prismic to create and manage the content of the website
  - A Headless CMS, that gives you full power over how the content is processed in your front ends
  - Allows you to abstract away the technology layer so you can reuse the content no matter how we build the website
- Gatsby, a static site generator to create the frontend
  - React based
  - Easy to use
  - Great development experience
  - Fast AF
- Netlify, to watch changes in our Repo and in Prismic that rebuilds our website, hosts it and pushes it into production
  - Pretty much the default setup for gatsby websites, deploys in 1-2 minutes

## Setup

### Development

1. Install the gatsby CLI: `npm install -g gatsby-cli`
2. Add 2 environment files `.env.development` and `.env.production` with the repo and api key from Prismic (https://e-potek.prismic.io/settings/apps/):

```
PRISMIC_REPO=
PRISMIC_API_KEY=
```

3. Start your development environment with `npm start`

You can preview content before publishing it [This needs to be configured in Prismic]. This is helpful if you're working on draft content and don't want to publish it yet.

### Deployment

Gatsby builds on Netlify will primarily be triggered by commits to the e-Potek GitHub monorepo.

Currently, the following actions will trigger a build:

- commits to gatsby-prismic branch -> "production" build - https://e-potek.netlify.app
- pull requests to gatsby-prismic branch-> deploy previews, with dynamic url generated at build time
