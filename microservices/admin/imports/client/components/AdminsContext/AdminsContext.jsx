import React, { useContext } from 'react';

import { updateDocument } from 'core/api/methods/methodDefinitions';
import { updateUser } from 'core/api/users/methodDefinitions';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import { employeesById } from 'core/arrays/epotekEmployees';
import AdminsContext from 'core/contexts/AdminsContext';
import useCurrentUser from 'core/hooks/useCurrentUser';
import useMeteorData from 'core/hooks/useMeteorData';

export const AdminsProvider = Component => props => {
  const currentUser = useCurrentUser();
  const { data = [] } = useMeteorData(
    {
      query: currentUser && USERS_COLLECTION,
      params: {
        $filters: { 'roles._id': ROLES.ADMIN },
        $options: { sort: { firstName: 1 } },
        firstName: 1,
        isInRoundRobin: 1,
        office: 1,
        roles: 1,
        roundRobinTimeout: 1,
      },
      refetchOnMethodCall: [updateUser, updateDocument],
    },
    [currentUser?._id], // Make sure there is no race condition, where the current user is not yet logged in
  );

  // This can be null sometimes
  const allData = (data || []).map(user => ({
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
