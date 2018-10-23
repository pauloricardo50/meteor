import React from 'react';
import { Provider } from './loan-context';

export default Component => props => (
  <Provider value={props.loan}>
    <Component {...props} />
  </Provider>
);
