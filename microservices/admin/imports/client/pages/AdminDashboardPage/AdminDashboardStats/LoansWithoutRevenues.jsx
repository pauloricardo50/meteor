// @flow
import React, { useContext } from 'react';
import CountUp from 'react-countup';

import { loansWithoutRevenues } from 'core/api/stats/queries';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import DialogSimple from 'core/components/DialogSimple';
import Table from 'core/components/Table';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import { USERS_COLLECTION, LOANS_COLLECTION } from 'core/api/constants';
import { getUserDisplayName } from 'core/utils/userFunctions';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import StatItem from './StatItem';

type LoansWithoutRevenuesProps = {};

const LoansTable = ({ loans }) => (
  <Table
    columnOptions={[
      { id: 'Nom' },
      { id: 'Statut' },
      { id: 'Compte' },
      { id: 'Conseiller' },
    ]}
    rows={loans.map(loan => {
      const { _id, userCache, name, status } = loan;
      const userName = getUserDisplayName(userCache);
      const assigneeName = getUserDisplayName(
        userCache && userCache.assignedEmployeeCache,
      );
      return {
        id: _id,
        columns: [
          {
            label: (
              <CollectionIconLink
                relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
                key="loan"
              />
            ),
            raw: name,
          },
          <StatusLabel
            status={status}
            collection={LOANS_COLLECTION}
            key="status"
          />,
          {
            label: userCache ? (
              <CollectionIconLink
                relatedDoc={{
                  ...userCache,
                  name: userName,
                  collection: USERS_COLLECTION,
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
                    collection: USERS_COLLECTION,
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
const LoansWithoutRevenues = ({ loans }: LoansWithoutRevenuesProps) => {
  const isOk = loans.length === 0;
  const currentUser = useContext(CurrentUserContext);

  const ownLoans = loans.filter(
    ({ userCache }) =>
      userCache &&
      userCache.assignedEmployeeCache &&
      userCache.assignedEmployeeCache._id === currentUser._id,
  );

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

export default withSmartQuery({
  query: loansWithoutRevenues,
  dataName: 'loans',
})(LoansWithoutRevenues);
