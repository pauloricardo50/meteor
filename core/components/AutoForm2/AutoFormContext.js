import React, { useContext } from 'react';

const AutoFormContext = React.createContext();

export const AutoFormContextProvider = AutoFormContext.Provider;

export const useAutoFormContext = () => useContext(AutoFormContext);
