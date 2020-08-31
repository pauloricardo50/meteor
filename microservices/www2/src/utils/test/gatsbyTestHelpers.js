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

const blogBody = [
  {
    slice_type: 'hero',
    primary: {
      image_layout: 'Full Width',
      images: {
        url:
          'https://e-potek-public.s3.eu-central-1.amazonaws.com/epotek-localbusiness-image.jpg',
        dimensions: { width: 1200, height: 800 },
      },
    },
  },
];
const blogPosts = [
  {
    date: '2020-01-01',
    title: [{ type: 'heading1', text: 'Blog post A' }],
    body: blogBody,
    _meta: { id: 'A', lang: 'fr-ch', type: 'post', uid: 'blog-post-a' },
  },
  {
    date: '2020-02-01',
    title: [{ type: 'heading1', text: 'Blog post B' }],
    body: blogBody,
    _meta: { id: 'B', lang: 'fr-ch', type: 'post', uid: 'blog-post-b' },
  },
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

  blogPosts.forEach(blogPost => {
    actions.createNode({
      id: createNodeId(blogPost._meta.id),
      ...blogPost,
      internal: {
        type: 'blogPost',
        contentDigest: createContentDigest(blogPost),
        description: 'Prismic Blog Post',
      },
    });
  });
};

exports.createTestNodes = createTestNodes;
