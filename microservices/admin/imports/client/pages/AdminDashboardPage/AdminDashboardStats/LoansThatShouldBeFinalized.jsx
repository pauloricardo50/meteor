import React, { useContext } from 'react';
import CountUp from 'react-countup';

import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import {
  REVENUE_STATUS,
  REVENUE_TYPES,
} from 'core/api/revenues/revenueConstants';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import StatItem from './StatItem';

const LoansThatShouldBeFinalized = ({ showAll }) => {
  const { data, loading } = useStaticMeteorData({
    query: LOANS_COLLECTION,
    params: {
      $filters: {
        anonymous: { $ne: true },
        status: { $ne: LOAN_STATUS.FINALIZED },
      },
      name: 1,
      borrowers: { name: 1 },
      user: { name: 1 },
      revenues: { status: 1, type: 1 },
      userCache: 1,
    },
  });
  const currentUser = useContext(CurrentUserContext);

  if (loading) {
    return null;
  }

  const loans = data.filter(
    ({ revenues = [] }) =>
      revenues.length &&
      revenues.every(
        ({ status, type }) =>
          status === REVENUE_STATUS.CLOSED && type !== REVENUE_TYPES.INSURANCE,
      ),
  );

  const isOk = loans.length === 0;

  if (!showAll && isOk) {
    return null;
  }

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
      title="Dossiers qui devraient être finalisés"
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
            title="Dossiers qui devraient être finalisés"
          >
            <>
              <p className="description">
                Ce dossier devrait être finalisés car tous les revenus ont été
                encaissés!
              </p>

              <div>
                {loans.map(loan => (
                  <CollectionIconLink key={loan._id} relatedDoc={loan} />
                ))}
              </div>
            </>
          </DialogSimple>
        )
      }
      increment={`Dont ${ownLoans.length} à moi`}
    />
  );
};

export default LoansThatShouldBeFinalized;
