const path = require('path');
const SimpleDDP = require('simpleddp');
const ws = require('isomorphic-ws');

const isDevelopment = process.env.NODE_ENV === 'development';

const opts = {
  endpoint: isDevelopment
    ? 'ws://localhost:5500/websocket' // wss protocol doesn't seem to work in local
    : 'wss://backend.e-potek.ch/websocket',
  SocketConstructor: ws,
};

const meteorClient = new SimpleDDP(opts);

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  reporter,
}) => {
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

  // create graphql nodes for promotions
  let promotions;

  try {
    promotions = await meteorClient.call('named_query_PROMOTIONS_LIST');
  } catch (error) {
    reporter.error('Failed to get promotions data:', error);
  }

  if (promotions) {
    reporter.success('e-Potek: retrieve promotions data');

    promotions.forEach(promotion => {
      const {
        _id: id,
        documents,
        description = '',
        externalUrl = '',
        ...rest
      } = promotion;

      const node = {
        id,
        images: documents.promotionImage,
        description,
        externalUrl,
        ...rest,
        internal: {
          type: 'promotion',
          contentDigest: createContentDigest(promotion),
          description: 'e-Potek Promotion',
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

const onCreateWebpackConfig = ({ actions: { setWebpackConfig } }) => {
  // This should stay in this file for the alias to work
  setWebpackConfig({
    resolve: {
      symlinks: false,
      alias: {
        core: path.resolve(__dirname, 'src/core/'),
      },
    },
  });
};

export { onCreateWebpackConfig };
