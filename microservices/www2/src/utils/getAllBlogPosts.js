const fetch = require('node-fetch');

const API_ROOT = `https://${process.env.PRISMIC_REPO}.cdn.prismic.io/api/v2`;
const PAGE_SIZE = 100;

const query = '[[at(document.type, "post")]]';

const graphQuery = `{
	posts {
		edges {
			node {
				_meta {
					id
					uid
					tags
					type
					lang
					alternateLanguages {
						id
						uid
						type
						lang
					}
				}
				title
				date
				body {
					... on hero {
						type
						primary {
							section_id
							image_layout
							images
						}
					}
				}
			}
		}
	}
}`;

const searchParams = new URLSearchParams({
  ref: '',
  access_token: process.env.PRISMIC_API_KEY,
  q: query,
  graphQuery,
  pageSize: PAGE_SIZE,
});

const fetchQuery = `${API_ROOT}/documents/search?${searchParams.toString()}`;

const formatBlogPost = post => {
  const {
    alternateLanguages = [],
    id,
    lang,
    tags = [],
    type,
    uid,
    data = {},
  } = post;

  const { title = [], date, body = [] } = data;

  return {
    body,
    date,
    title,
    _meta: {
      alternateLanguages,
      id,
      lang,
      tags,
      type,
      uid,
    },
  };
};

const getAllBlogPosts = async () => {
  const postsData = await fetch(fetchQuery).then(res => res.json());

  const { results = [] } = postsData;

  return results.map(formatBlogPost);
};

module.exports = getAllBlogPosts;
