import { withProps } from 'recompose';

const createContainer = (propMapperFunction) => {
  console.log('creating container');
  return withProps(propMapperFunction);
};

export default createContainer;
