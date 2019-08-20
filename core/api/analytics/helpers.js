import { matchPath } from 'react-router-dom';

import { parseCookies } from 'core/utils/cookiesHelpers';
import { analyticsCTA } from '../methods';

export const getMatchingPath = ({ pathname, routes = {}, history }) => {
  let matchingPath = null;

  const searchParams = history.location.search;
  const queryString = {};

  Object.keys(routes).forEach((route) => {
    if (matchingPath === null && route !== 'NOT_FOUND') {
      const match = matchPath(pathname, routes[route]);

      if (searchParams) {
        const params = new URLSearchParams(searchParams);
        [...params.entries()].forEach(([key, value]) => {
          queryString[key] = value;
        });
      }

      matchingPath = match && {
        path: pathname,
        route,
        params: match.params,
        queryString,
      };
    }
  });

  return (
    matchingPath || {
      path: pathname,
      route: 'NOT_FOUND',
      params: {},
      queryString,
    }
  );
};

export const ctaClicked = ({ name, history, routes = {} }) => {
  const { path, route, params, searchParams, queryString } = getMatchingPath({
    pathname: history.location.pathname,
    routes,
    history,
  });

  const cookies = parseCookies();
  const { sessionStorage } = window;

  return analyticsCTA.run({
    name,
    cookies,
    sessionStorage,
    path,
    route,
    queryParams: params,
    queryString,
  });
};
