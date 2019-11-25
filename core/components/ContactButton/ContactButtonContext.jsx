import React, { useState } from 'react';

export const ContactButtonContext = React.createContext();

export const { Consumer, Provider } = ContactButtonContext;

export const withContactButtonProvider = Component => props => {
  const [openContact, setOpenContact] = useState(false);
  const toggleOpenContact = nextValue =>
    setOpenContact(prevValue =>
      nextValue === undefined ? !prevValue : nextValue,
    );

  return (
    <Provider value={{ openContact, toggleOpenContact }}>
      <Component {...props} />
    </Provider>
  );
};
