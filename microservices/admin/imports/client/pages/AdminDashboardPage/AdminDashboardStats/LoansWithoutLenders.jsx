import React, { useContext } from 'react';
import groupBy from 'lodash/groupBy';
import CountUp from 'react-countup';

import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import StatItem from './StatItem';

const LoansWithoutLenders = ({ showAll }) => {
  const currentUser = useContext(CurrentUserContext);
  const { data: loans = [], loading } = useStaticMeteorData({
    query: LOANS_COLLECTION,
    params: {
      $filters: {
        status: { $in: [LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED] },
        $or: [
          { 'structureCache.offerId': { $exists: false } },
          { 'structureCache.offerId': '' },
        ],
      },
      mainAssignee: 1,
      name: 1,
    },
  });
  const groupedLoans = groupBy(loans, 'mainAssignee.name');
  const myLoans = loans.filter(
    ({ mainAssignee }) => mainAssignee?._id === currentUser._id,
  );
  const isOk = loans.length === 0;

  if (!showAll && isOk) {
    return null;
  }

  return (
    <StatItem
      value={<CountUp end={loans.length} preserveValue separator=" " />}
      increment={`Dont ${myLoans.length} à moi`}
      positive={myLoans.length === 0}
      title="Dossiers sans prêteur"
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
            title="Dossiers sans prêteur"
          >
            <>
              <p className="description">
                Il manque un prêteur choisi sur ces dossiers. Il faut ajouter
                une offre de ce prêteur, puis la choisir sur le plan financier.
              </p>

              <div className="flex-col">
                {!loading &&
                  Object.keys(groupedLoans).map(assignee => (
                    <div key={assignee}>
                      <h3>{assignee}</h3>
                      {groupedLoans[assignee].map(loan => (
                        <CollectionIconLink
                          key={loan._id}
                          relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </>
          </DialogSimple>
        )
      }
    />
  );
};

export default LoansWithoutLenders;
