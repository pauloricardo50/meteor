import React from 'react';
import { Consumer } from './loan-context';

export default Component => props => (
  <Consumer>{({ loan }) => <Component {...props} loan={loan} />}</Consumer>
);
