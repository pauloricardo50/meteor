# e-Potek www v2

Our brand website is built on the following stack:

* Contentful to create and manage the content of the website
  * A Headless CMS, that gives you full power over how the content is processed in your front ends
  * Allows you to abstract away the technology layer so you can reuse the content no matter how we build the website
* Gatsby, a static site generator to create the frontend
  * React based
  * Easy to use
  * Great development experience
  * Fast AF
* Netlify, to watch changes in our Repo and in Contentful that rebuilds our website, hosts it and pushes it into production
  * Pretty much the default setup for gatsby websites, deploys in 10-30 seconds

## Setup

1. Install the gatsby CLI: `npm install -g gatsby-cli`
2. Add 2 environment files `.env.development` and `.env.production` with the following data from contentful.js:

```
CONTENTFUL_SPACE_ID='spaceId'
CONTENTFUL_ACCESS_TOKEN='accessToken'
```

3. Start your development environment with `npm start`