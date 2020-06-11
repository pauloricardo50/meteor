import React, { useContext } from 'react';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import { employeesById } from 'core/arrays/epotekEmployees';
import useMeteorData from 'core/hooks/useMeteorData';

export const AdminsContext = React.createContext();

export const AdminsProvider = Component => props => {
  const { data = [] } = useMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADMIN },
      isInRoundRobin: 1,
      roundRobinTimeout: 1,
      roles: 1,
    },
  });
  const allData = data.map(user => ({
    ...user,
    ...employeesById[user._id],
    isAvailable: !user.roundRobinTimeout,
    role: user.roles[0]._id,
  }));

  return (
    <AdminsContext.Provider value={allData}>
      <Component {...props} />
    </AdminsContext.Provider>
  );
};

export const useAdmins = () => useContext(AdminsContext);
