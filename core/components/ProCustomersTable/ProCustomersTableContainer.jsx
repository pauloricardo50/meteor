import React from 'react';
import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proLoans } from 'core/api/loans/queries';
import { getReferredBy } from 'core/api/helpers';
import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import ProCustomer from 'core/components/ProCustomer';
import LoanProgress from 'core/components/LoanProgress';
import LoanProgressHeader from 'core/components/LoanProgress/LoanProgressHeader';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';

const columnOptions = [
  { id: 'loanName', style: { whiteSpace: 'nowrap' } },
  { id: 'status' },
  { id: 'progress', label: <LoanProgressHeader /> },
  { id: 'customer' },
  { id: 'createdAt' },
  { id: 'relatedTo' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`ProCustomersTable.${id}`} />,
}));

const makeMapLoan = ({ proUser, isAdmin }) => (loan) => {
  const {
    _id: loanId,
    status,
    user,
    createdAt,
    name: loanName,
    relatedTo: relatedDocs = [],
    loanProgress,
    anonymous,
  } = loan;

  const referredBy = getReferredBy({ user, proUser, isAdmin, anonymous });

  return {
    id: loanId,
    columns: [
      {
        raw: loanName,
        label: isAdmin ? (
          <CollectionIconLink
            relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
          />
        ) : (
          loanName
        ),
      },
      {
        raw: status,
        label: <StatusLabel status={status} collection={LOANS_COLLECTION} />,
      },
      {
        raw: loanProgress.verificationStatus,
        label: <LoanProgress loanProgress={loanProgress} />,
      },
      {
        raw: user.name,
        label: <ProCustomer user={user} invitedByUser={referredBy.label} />,
      },
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      {
        raw: relatedDocs.length ? relatedDocs[0]._id : '-',
        label: relatedDocs.length
          ? relatedDocs.map(relatedDoc => (
            <CollectionIconLink
              key={relatedDoc._id}
              relatedDoc={relatedDoc}
            />
          ))
          : '-',
      },
    ],
  };
};

const getAnonymous = withAnonymous =>
  (withAnonymous ? undefined : { $in: [null, false] });

export default compose(
  withState('status', 'setStatus', {
    $in: Object.values(LOAN_STATUS).filter(s => s !== LOAN_STATUS.UNSUCCESSFUL && s !== LOAN_STATUS.TEST),
  }),
  withState('withAnonymous', 'setWithAnonymous', false),
  withState(
    'referredByUserId',
    'setReferredByUserId',
    ({ proUser }) => proUser._id,
  ),
  withSmartQuery({
    query: proLoans,
    params: ({
      proUser: { _id: userId },
      isAdmin = false,
      status,
      withAnonymous,
      referredByUserId,
    }) => ({
      ...(isAdmin ? { userId } : {}),
      status,
      anonymous: getAnonymous(withAnonymous),
      referredByUserId,
      fetchOrganisationLoans: !referredByUserId,
    }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
  withProps(({ loans, proUser, isAdmin = false }) => {
    console.log('loans:', loans);

    return {
      rows: loans.map(makeMapLoan({ proUser, isAdmin })),
      columnOptions,
    };
  }),
);
