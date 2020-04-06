import React, { useContext } from 'react';
import CountUp from 'react-countup';

import { incoherentAssignees } from 'core/api/users/queries';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import StatItem from './StatItem';

const IncoherentAssignees = ({ showAll }) => {
  const currentUser = useContext(CurrentUserContext);
  const { data: users = [], loading } = useStaticMeteorData({
    query: incoherentAssignees,
    refetchOnMethodCall: false,
  });
  const myUsers = users.filter(
    ({ assignedEmployeeId }) => assignedEmployeeId === currentUser._id,
  );
  const isOk = users.length === 0;

  if (!showAll && isOk) {
    return null;
  }

  return (
    <StatItem
      value={<CountUp end={users.length} preserveValue separator=" " />}
      increment={`Dont ${myUsers.length} à moi`}
      positive={myUsers.length === 0}
      title="Conseillers incohérents"
      top={
        isOk ? (
          <p>Tout est bon!</p>
        ) : (
          <DialogSimple
            buttonProps={{
              label: 'Afficher comptes concernés',
              raised: false,
              primary: true,
            }}
            closeOnly
            maxWidth="lg"
            title="Conseillers incohérents"
          >
            <>
              <p className="description">
                Ces comptes ont un conseiller qui est différent du conseiller
                sur chacun de leur dossiers. Il faut soit changer le conseiller
                du compte, soit changer le conseiller du dossier.
              </p>

              <div className="flex-col">
                {!loading &&
                  users.map(user => (
                    <CollectionIconLink key={user._id} relatedDoc={user} />
                  ))}
              </div>
            </>
          </DialogSimple>
        )
      }
    />
  );
};

export default IncoherentAssignees;
