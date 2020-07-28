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
  { city: 'Genève', count: 10, ...classifiedCities['1201'] },
  { city: 'Lausanne', count: 10, ...classifiedCities['1000'] },
  { city: 'Yverdon', count: 10, ...classifiedCities['1400'] },
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
