const classifiedCities = require('../../core/api/gpsStats/server/classifiedCities.json');

const fakeNewsletters = [
  {
    id: 'a',
    sendDate: new Date(),
    title: 'Newsletter 1',
    url: 'https://www.e-potek.ch',
  },
];

const fakeGpsStats = [
  { count: 10, ...classifiedCities['1000'] },
  { count: 10, ...classifiedCities['1200'] },
  { count: 10, ...classifiedCities['1400'] },
];

const createTestNodes = ({ actions, createContentDigest, createNodeId }) => {
  fakeNewsletters.forEach(newsletter => {
    actions.createNode({
      ...newsletter,
      internal: {
        type: 'newsletter',
        contentDigest: createContentDigest(newsletter),
        description: 'e-Potek Newsletter',
      },
    });
  });
  fakeGpsStats.forEach(gpsStat => {
    actions.createNode({
      id: createNodeId(gpsStat.city),
      ...gpsStat,
      internal: {
        type: 'gpsStat',
        contentDigest: createContentDigest(gpsStat),
        description: 'e-Potek GPS Stat',
      },
    });
  });
};

exports.createTestNodes = createTestNodes;
