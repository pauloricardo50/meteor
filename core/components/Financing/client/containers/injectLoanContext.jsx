import React from 'react';

import { Provider } from './loan-context';

export default Component => props => (
  <Provider value={{ loan: props.loan, Calculator: props.Calculator }}>
    <Component {...props} />
  </Provider>
);
