import React from 'react';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import { employeesById } from 'core/arrays/epotekEmployees';
import useMeteorData from 'core/hooks/useMeteorData';

export const AdvisorContext = React.createContext();

export const AdvisorProvider = ({ children }) => {
  const { data = [] } = useMeteorData({
    query: USERS_COLLECTION,
    params: { $filters: { 'roles._id': ROLES.ADMIN } },
    isInRoundRobin: 1,
    roundRobinTimeout: 1,
  });
  const allData = data.map(user => ({
    ...user,
    ...employeesById[user._id],
    isAvailable: !user.roundRobinTimeout,
  }));

  return (
    <AdvisorContext.Provider value={allData}>
      {children}
    </AdvisorContext.Provider>
  );
};
