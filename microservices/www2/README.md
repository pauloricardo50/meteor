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

### Development

1. Install the gatsby CLI: `npm install -g gatsby-cli`
2. Add 2 environment files `.env.development` and `.env.production` with the following data from contentful.com (https://app.contentful.com/spaces/w7hxxjveit99/api/keys):

```
CONTENTFUL_SPACE_ID='spaceId'
CONTENTFUL_ACCESS_TOKEN='accessToken'
```

3. Start your development environment with `npm start`

You can get access to "Draft" data from Contentful, is you use the "Preview API" instead of the "Delivery API". This is helpful if you're working on draft content and don't want to publish it yet.

### Deployment

* Install netlify's CLI for linux or macOS (https://github.com/netlify/netlifyctl): 
```
brew tap netlify/netlifyctl
brew install netlifyctl
```
* Login (make sure you have a netlify account first: netlify.com): `netlifyctl login`
* Deploy the site using `npm run deploy`

Netlify also listens to webhooks from Contentful to automatically trigger a rebuild
