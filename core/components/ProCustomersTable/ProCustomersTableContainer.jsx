import React from 'react';
import { compose, mapProps, withProps, withState } from 'recompose';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proLoans } from 'core/api/loans/queries';
import { getReferredBy } from 'core/api/helpers';
import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';

import LoanProgress from 'core/components/LoanProgress';
import LoanProgressHeader from 'core/components/LoanProgress/LoanProgressHeader';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';

const columnOptions = [
  { id: 'loanName', style: { whiteSpace: 'nowrap' } },
  { id: 'status' },
  { id: 'progress', label: <LoanProgressHeader /> },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'referredBy' },
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
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      getReferredBy({ user, proUser, isAdmin, anonymous }),
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

export default compose(
  mapProps(({ proUser, ...props }) => {
    const { promotions = [], proProperties = [] } = proUser;
    return {
      ...props,
      proUser,
      propertyIds: proProperties.map(({ _id }) => _id),
      promotionIds: promotions.map(({ _id }) => _id),
    };
  }),
  withState('status', 'setStatus', {
    $in: Object.values(LOAN_STATUS).filter(s => s !== LOAN_STATUS.UNSUCCESSFUL && s !== LOAN_STATUS.TEST),
  }),
  withSmartQuery({
    query: proLoans,
    params: ({
      propertyIds,
      promotionIds,
      proUser: { _id: userId },
      isAdmin = false,
      status,
    }) => ({
      ...(isAdmin ? { userId } : {}),
      promotionId: { $in: promotionIds },
      propertyId: { $in: propertyIds },
      status,
    }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
  withProps(({ loans, proUser, isAdmin = false }) => ({
    rows: loans.map(makeMapLoan({ proUser, isAdmin })),
    columnOptions,
  })),
);
