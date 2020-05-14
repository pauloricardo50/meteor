const path = require('path');
const SimpleDDP = require('simpleddp');
const ws = require('isomorphic-ws');

const opts = {
  endpoint: 'wss://backend.e-potek.ch/websocket',
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
      cantons: ['GE', 'VD', 'FR', 'NE', 'VS'],
    });
  } catch (error) {
    reporter.error('Failed to get gps stats data:', error);
  }

  if (gpsStats) {
    reporter.success('e-Potek: retrieve gps stats data');

    gpsStats.forEach(gpsStat => {
      const node = {
        id: createNodeId(gpsStat.city),
        city: gpsStat.city,
        zipCode: gpsStat.zipCode,
        lat: gpsStat.lat,
        long: gpsStat.long,
        count: gpsStat.count,
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
      const node = {
        id: promotion._id,
        name: promotion.name,
        images: promotion.documents.promotionImage,
        address: promotion.address,
        lotsCount: promotion.lotsCount,
        isTest: promotion.isTest,
        internal: {
          type: 'promotion',
          contentDigest: createContentDigest(promotion),
          description: 'e-Potek Promotion',
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
