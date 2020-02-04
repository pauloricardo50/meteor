//      
import { withRouter, matchPath } from 'react-router-dom';
import isArray from 'lodash/isArray';
import { compose, mapProps } from 'recompose';

// Lets you pass a param as a string, or an array of params, and you will get
// them as simple props from react-router, instead of drilling down
// match.params.paramName
export default (
  paramName                                    ,
  path,
  { passProps } = {},
) =>
  compose(
    withRouter,
    mapProps(({ match, history, location, ...rest }) => {
      let realMatch;
      if (path) {
        realMatch = matchPath(history.location.pathname, {
          path,
          exact: false,
          strict: false,
        });
      } else {
        realMatch = match;
      }

      if (!realMatch) {
        return { ...rest };
      }

      if (isArray(paramName)) {
        return paramName.reduce(
          (acc, param) => ({ ...acc, [param]: realMatch.params[param] }),
          { ...rest },
        );
      }

      if (typeof paramName === 'function') {
        const paramNameFromProps = paramName(rest);
        return {
          [paramNameFromProps]: realMatch.params[paramNameFromProps],
          ...rest,
        };
      }

      if (passProps) {
        return {
          match,
          history,
          location,
          [paramName]: realMatch.params[paramName],
          ...rest,
        };
      }

      return { [paramName]: realMatch.params[paramName], ...rest };
    }),
  );
