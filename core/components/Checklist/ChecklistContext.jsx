import React, { useContext } from 'react';

export const ChecklistContext = React.createContext();

export const useChecklistContext = () => useContext(ChecklistContext);

export const withChecklistContext = getValue => Component => props => (
  <ChecklistContext.Provider value={getValue(props)}>
    <Component {...props} />
  </ChecklistContext.Provider>
);
