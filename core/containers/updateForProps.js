import { shouldUpdate } from 'recompose';

import { arePathsUnequal } from '../utils/reactFunctions';

// Given an array of prop paths, only rerender the component
// when they change
export default paths => shouldUpdate(arePathsUnequal(paths));

export const ignoreProps = propNames =>
  shouldUpdate((props, nextProps) => {
    let update = false;

    Object.keys(nextProps)
      .filter(propName => !propNames.includes(propName))
      .some(propName => {
        const prop = nextProps[propName];

        if (prop !== props[propName]) {
          update = true;
          return true;
        }

        return false;
      });

    return update;
  });
