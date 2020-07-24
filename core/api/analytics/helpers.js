import { matchPath } from 'react-router-dom';

import { parseCookies } from '../../utils/cookiesHelpers';
import { analyticsCTA } from './methodDefinitions';

export const getMatchingPath = ({
  pathname,
  routes = {},
  history = { location: {} },
}) => {
  let matchingPath = null;

  const searchParams = history.location.search;
  const queryString = {};

  Object.keys(routes).forEach(route => {
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

export const ctaClicked = ({ name, history, routes = {}, toPath }) => {
  const { path, route } = getMatchingPath({
    pathname: history.location.pathname,
    routes,
    history,
  });

  const cookies = parseCookies();

  return analyticsCTA.run({ name, cookies, path, route, toPath });
};
