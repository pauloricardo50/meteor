import React from 'react';

const withContextProvider = ({ Context, value }) => Component => props => (
  <Context.Provider value={typeof value === 'function' ? value(props) : value}>
    <Component {...props} />
  </Context.Provider>
);

export default withContextProvider;
