import React from 'react';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import StatItem from './StatItem';

const CustomersWithoutAssignees = ({ showAll }) => {
  // We need to query both for undefined or null values in the assignedEmployeeId
  const { data: users1 = [], loading: loading1 } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: {
        roles: { $elemMatch: { _id: ROLES.USER, assigned: true } },
        assignedEmployeeId: { $exists: false },
      },
      name: 1,
    },
    refetchOnMethodCall: false,
  });
  const { data: users2 = [], loading: loading2 } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: {
        roles: { $elemMatch: { _id: ROLES.USER, assigned: true } },
        assignedEmployeeId: { $type: 'null' },
      },
      name: 1,
    },
    refetchOnMethodCall: false,
  });
  const users = [...users1, ...users2];
  const isLoading = loading1 || loading2;
  const isOk = !isLoading && users.length === 0;

  if (!showAll && isOk) {
    return null;
  }

  return (
    <StatItem
      title={<span>Clients sans conseiller</span>}
      value={!isLoading && users.length}
      top={
        isOk ? (
          <p>Tout est bon!</p>
        ) : (
          <DialogSimple
            buttonProps={{
              label: 'Afficher clients concernés',
              raised: false,
              primary: true,
            }}
            closeOnly
            maxWidth="lg"
            title="Clients sans conseiller"
          >
            <div className="flex-col">
              {!isLoading &&
                users.map(user => (
                  <CollectionIconLink key={user._id} relatedDoc={user} />
                ))}
            </div>
          </DialogSimple>
        )
      }
    />
  );
};

export default CustomersWithoutAssignees;
