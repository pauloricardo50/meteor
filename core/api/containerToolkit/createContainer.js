import { withProps } from 'recompose';

const createContainer = propMapperFunction => withProps(propMapperFunction);

export default createContainer;
