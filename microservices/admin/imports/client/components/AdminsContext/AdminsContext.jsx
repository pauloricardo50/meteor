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
      $options: { sort: { firstName: 1 } },
      firstName: 1,
      isInRoundRobin: 1,
      office: 1,
      roles: 1,
      roundRobinTimeout: 1,
    },
  });
  const allData = data.map(user => ({
    ...user,
    ...employeesById[user._id],
    isAvailable: !user.roundRobinTimeout,
    role: user.roles[0]._id,
  }));

  const filteredData = {
    all: allData,
    advisors: allData.filter(({ role }) => role === ROLES.ADVISOR),
  };

  return (
    <AdminsContext.Provider value={filteredData}>
      <Component {...props} />
    </AdminsContext.Provider>
  );
};

export const useAdmins = () => useContext(AdminsContext);
