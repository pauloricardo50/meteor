import React from 'react';

export const { Consumer, Provider } = React.createContext();

export default translationValues => Component => props => (
  <Consumer>
    {(translationContext = {}) => (
      <Provider value={{ ...translationContext, ...translationValues(props) }}>
        <Component {...props} />
      </Provider>
    )}
  </Consumer>
);
