import { createContext, useContext, useEffect, useReducer } from 'react';

import { prismicPageFields, prismicPostFields } from '../utils/fragments';

export const BlogPostsContext = createContext();

const useBlogPostsContext = () => useContext(BlogPostsContext);

const reducer = (state, action) => {
  const { endCursor, hasNextPage } = state.pageInfo;

  switch (action.type) {
    case 'more': {
      if (hasNextPage) {
        return {
          ...state,
          prismicVariables: { blogAfter: endCursor },
        };
      }
      break;
    }

    case 'setData': {
      return {
        ...state,
        hasNextPage: action.payload.pageInfo.hasNextPage,
        posts: action.payload.posts,
        pageInfo: action.payload.pageInfo,
      };
    }

    default:
      break;
  }

  return state;
};

export const useBlogPosts = ({ prismic, data: initialData }) => {
  const [state, dispatch] = useReducer(reducer, {
    posts: initialData.edges,
    pageInfo: initialData.pageInfo,
  });
  const { posts = [], hasNextPage } = state;

  useEffect(() => {
    prismic
      .load({
        variables: state.prismicVariables,
        fragments: [prismicPageFields, prismicPostFields],
      })
      .then(data =>
        dispatch({
          type: 'setData',
          payload: {
            posts: [...posts, ...data.data.allPosts.edges],
            pageInfo: data.data.allPosts.pageInfo,
          },
        }),
      );
  }, [state.prismicVariables]);

  return {
    posts,
    hasNextPage,
    loadMore: () => dispatch({ type: 'more' }),
  };
};

export default useBlogPostsContext;
