import React from 'react';
import { compose, withState } from 'recompose';

const { Consumer, Provider } = React.createContext();

export const withContactButtonProvider = compose(
  withState('openContact', 'toggleOpenContact', false),
  Component => (props) => {
    const { openContact, toggleOpenContact } = props;
    return (
      <Provider value={{ openContact, toggleOpenContact }}>
        <Component {...props} />
      </Provider>
    );
  },
);

export const withContactButtonContext = Component => props => (
  <Consumer>{context => <Component {...props} {...context} />}</Consumer>
);
