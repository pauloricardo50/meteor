import React from 'react';
import { compose, withState } from 'recompose';

export const ContactButtonContext = React.createContext();

export const { Consumer, Provider } = ContactButtonContext;

export const withContactButtonProvider = compose(
  withState('openContact', 'toggleOpenContact', false),
  Component => ({ openContact, toggleOpenContact, ...props }) => (
    <Provider value={{ openContact, toggleOpenContact }}>
      <Component {...props} />
    </Provider>
  ),
);
