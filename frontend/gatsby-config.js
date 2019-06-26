const SERVER_URL = ' https://a0veo2tny8.execute-api.us-east-1.amazonaws.com/dev/graphql'

module.exports = {
  siteMetadata: {
    title: `5min2win`,
    description: `5min2win cool stuf`,
    author: `@5min2win.com`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },{
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'WIDGET',
        fieldName: 'widgetsapi',
        url: SERVER_URL,
        refetchInterval: 60,
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
      
    },
    `gatsby-plugin-styled-components`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
