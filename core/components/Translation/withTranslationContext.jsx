import React from 'react';

export const { Consumer, Provider } = React.createContext();

const withTranslationContext = translationValues => Component => props => (
  <Consumer>
    {(translationContext = {}) => (
      <Provider value={{ ...translationContext, ...translationValues(props) }}>
        <Component {...props} />
      </Provider>
    )}
  </Consumer>
);

export default withTranslationContext;
