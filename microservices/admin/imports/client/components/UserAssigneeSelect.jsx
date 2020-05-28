import React from 'react';

import { assignAdminToUser } from 'core/api/users/methodDefinitions';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

const UserAssigneeSelect = ({ userId, assignedEmployeeId }) => {
  const { data = [] } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      name: 1,
      office: 1,
    },
    refetchOnMethodCall: false,
  });

  return (
    <Select
      value={assignedEmployeeId || null}
      onChange={newAssigneeId => {
        assignAdminToUser.run({
          userId,
          adminId: newAssigneeId,
        });
      }}
      options={[
        { id: null, label: 'Personne' },
        ...data.map(({ _id, name, office }) => ({
          id: _id,
          label: name,
          office,
        })),
      ]}
      grouping={{
        groupBy: 'office',
        format: x => <T id={`Forms.office.${x}`} />,
      }}
      displayEmpty
    />
  );
};

export default UserAssigneeSelect;
