require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: 'e-Potek',
    description: "La révolution de l'hypothèque",
    siteUrl: `https://www.e-potek.ch`, // Necessary for the sitemap
  },
  plugins: [
    {
      resolve: `gatsby-plugin-material-ui`,
      options: { stylesProvider: { injectFirst: true } },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        // importing here allows variables and mixins to be used in any scss file
        data:
          '@import "src/core/assets/css/variables.scss";@import "src/core/assets/css/mixins.scss";',
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'e-Potek',
        short_name: 'e-Potek',
        start_url: '/',
        background_color: '#005bea',
        theme_color: '#005bea',
        display: 'minimal-ui',
        icon: 'src/images/epotek_logo.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: '@prismicio/gatsby-source-prismic-graphql',
      options: {
        repositoryName: process.env.PRISMIC_REPO,
        accessToken: process.env.PRISMIC_API_KEY,
        langs: ['fr-ch'],
        defaultLang: 'fr-ch',
        shortenUrlLangs: true,
        path: '/preview',
        previews: true,
        pages: [
          {
            type: 'Page',
            match: '/:lang/:uid',
            component: require.resolve('./src/templates/page.jsx'),
          },
          {
            type: 'Post',
            match: '/:lang/blog/:uid',
            component: require.resolve('./src/templates/post.jsx'),
          },
        ],
      },
    },
  ],
};
