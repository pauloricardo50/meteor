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
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-offline',
    'gatsby-plugin-sass',
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
      resolve: 'gatsby-source-prismic-graphql',
      options: {
        repositoryName: process.env.PRISMIC_REPO,
        accessToken: process.env.PRISMIC_API_KEY,
        langs: ['fr-ch', 'en-us'],
        shortenUrlLangs: true,
        path: '/preview',
        previews: true,
        sharpKeys: [
          /image|photo|picture/, // (default)
          'profilepic',
        ],
      },
    },
  ],
};
