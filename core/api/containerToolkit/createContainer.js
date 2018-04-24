import { withProps } from 'recompose';

const createContainer = (propMapper) => {
  if (typeof propMapper === 'function') {
    // If it's a function, return it like it is
    return withProps(propMapper);
  } else if (typeof propMapper === 'object') {
    // Else it should be an object and it can be used as well
    return withProps(() => propMapper);
  }

  throw 'createContainer can only take a function or an object';
};

export default createContainer;
