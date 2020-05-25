import React from 'react';
import CountUp from 'react-countup';

import { loansWithoutRevenues } from 'core/api/stats/queries';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel';
import Table from 'core/components/Table';
import useCurrentUser from 'core/hooks/useCurrentUser';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { getUserDisplayName } from 'core/utils/userFunctions';

import StatItem from './StatItem';

const LoansTable = ({ loans }) => (
  <Table
    columnOptions={[
      { id: 'Nom' },
      { id: 'Statut' },
      { id: 'Compte' },
      { id: 'Conseiller' },
    ]}
    rows={loans.map(loan => {
      const { _id, userCache, name, status, _collection } = loan;
      const userName = getUserDisplayName(userCache);
      const assigneeName = getUserDisplayName(
        userCache && userCache.assignedEmployeeCache,
      );
      return {
        id: _id,
        columns: [
          {
            label: <CollectionIconLink relatedDoc={loan} key="loan" />,
            raw: name,
          },
          <StatusLabel status={status} collection={_collection} key="status" />,
          {
            label: userCache ? (
              <CollectionIconLink
                relatedDoc={{
                  ...userCache,
                  name: userName,
                  _collection: USERS_COLLECTION,
                }}
              />
            ) : (
              '-'
            ),
            raw: userName,
          },
          {
            label:
              userCache && userCache.assignedEmployeeCache ? (
                <CollectionIconLink
                  relatedDoc={{
                    ...userCache.assignedEmployeeCache,
                    name: assigneeName,
                    _collection: USERS_COLLECTION,
                  }}
                />
              ) : (
                '-'
              ),
            raw: assigneeName,
          },
        ],
      };
    })}
  />
);

const LoansWithoutRevenues = ({ showAll }) => {
  const { data: loans = [], loading } = useStaticMeteorData({
    query: loansWithoutRevenues,
    dataName: 'loans',
    refetchOnMethodCall: false,
  });
  const isOk = loans.length === 0;
  const currentUser = useCurrentUser();

  const ownLoans = loans.filter(
    ({ userCache }) =>
      userCache &&
      userCache.assignedEmployeeCache &&
      userCache.assignedEmployeeCache._id === currentUser._id,
  );

  if (!showAll && isOk) {
    return null;
  }

  return (
    <StatItem
      value={<CountUp end={loans.length} preserveValue separator=" " />}
      positive={ownLoans.length === 0}
      title="Dossiers sans revenus"
      top={
        isOk ? (
          <p>Tout est bon!</p>
        ) : (
          <DialogSimple
            buttonProps={{
              label: 'Afficher dossiers concernés',
              raised: false,
              primary: true,
            }}
            closeOnly
            maxWidth="lg"
            title="Dossiers sans revenus"
          >
            <LoansTable loans={loans} />
          </DialogSimple>
        )
      }
      increment={`Dont ${ownLoans.length} à moi`}
    />
  );
};

export default LoansWithoutRevenues;
