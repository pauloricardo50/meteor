const { meteorClient } = require('./src/utils/meteorClient/meteorClient');
const { createTestNodes } = require('./src/utils/test/gatsbyTestHelpers');

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  reporter,
}) => {
  reporter.info('Creating e-Potek nodes');
  if (process.env.GATSBY_E2E_TEST) {
    createTestNodes({
      actions,
      createContentDigest,
      createNodeId,
      reporter,
    });
    reporter.success('Created E2E test nodes :)');

    return;
  }

  // create graphql nodes for gps stats data
  let gpsStats;

  try {
    gpsStats = await meteorClient.call('getGpsStats', {
      cantons: ['GE', 'VD', 'FR', 'NE', 'VS', 'JU'],
    });
  } catch (error) {
    reporter.error('Failed to get gps stats data:', error);
  }

  if (gpsStats) {
    reporter.success('e-Potek: retrieve gps stats data');

    gpsStats.forEach(gpsStat => {
      const node = {
        id: createNodeId(gpsStat.city),
        ...gpsStat,
        internal: {
          type: 'gpsStat',
          contentDigest: createContentDigest(gpsStat),
          description: 'e-Potek GPS Stat',
        },
      };
      actions.createNode(node);
    });
  }

  // create graphql nodes for recent newsletters
  let recentNewsletters;

  try {
    recentNewsletters = await meteorClient.call(
      'named_query_RECENT_NEWSLETTERS',
    );
  } catch (error) {
    reporter.error('Failed to get recent newsletters data:', error);
  }

  if (recentNewsletters) {
    reporter.success('e-Potek: retrieve recent newsletters data');

    recentNewsletters.forEach(newsletter => {
      const node = {
        ...newsletter,
        internal: {
          type: 'newsletter',
          contentDigest: createContentDigest(newsletter),
          description: 'e-Potek Newsletter',
        },
      };
      actions.createNode(node);
    });
  }
};

exports.onCreateWebpackConfig = ({ actions: { setWebpackConfig } }) => {
  // This should stay in this file for the alias to work
  const config = require('./webpack.config.js');
  setWebpackConfig(config);
};
