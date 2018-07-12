// @flow
import { withRouter } from 'react-router-dom';
import isArray from 'lodash/isArray';
import { compose, withProps } from 'recompose';

// Lets you pass a param as a string, or an array of params, and you will get
// them as simple props from react-router, instead of drilling down
// match.params.paramName
export default (paramName: string | string[]) =>
  compose(
    withRouter,
    withProps(({ match }) =>
      (isArray(paramName)
        ? paramName.reduce(
          (acc, param) => ({ ...acc, [param]: match.params[param] }),
          {},
        )
        : { [paramName]: match.params[paramName] })),
  );
