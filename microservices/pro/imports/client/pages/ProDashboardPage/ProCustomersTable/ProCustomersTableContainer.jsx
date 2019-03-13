import React from 'react';
import { compose, mapProps, withProps } from 'recompose';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proLoans from 'core/api/loans/queries/proLoans';
import { getUserNameAndOrganisation } from 'core/api/helpers';
import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import LoanProgress from 'core/components/LoanProgress/LoanProgress';
import LoanProgressHeader from 'core/components/LoanProgress/LoanProgressHeader';
import { LOANS_COLLECTION } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';

const columnOptions = [
  { id: 'loanName' },
  { id: 'status' },
  { id: 'progress', label: <LoanProgressHeader /> },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'referredBy' },
  { id: 'relatedTo' },
  // { id: 'estimatedRevenues' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`ProCustomersTable.${id}`} />,
}));

const getReferredBy = ({ user, currentUser }) => {
  const { referredByUser = {}, referredByOrganisation = {} } = user;
  const { _id: userId, organisations = [] } = currentUser;
  let label = 'XXX';

  if (
    referredByUser._id === userId
    || organisations.some(({ _id }) => _id === referredByOrganisation._id)
  ) {
    label = getUserNameAndOrganisation({ user: referredByUser });
  }

  return {
    raw: user && user.referredByUser,
    label,
  };
};

const makeMapLoan = currentUser => (loan) => {
  const {
    _id: loanId,
    status,
    user,
    createdAt,
    name: loanName,
    relatedTo: relatedDoc,
    loanProgress,
    estimatedRevenues,
  } = loan;

  return {
    id: loanId,
    columns: [
      loanName,
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
      getReferredBy({ user, currentUser }),
      {
        raw: relatedDoc ? relatedDoc._id : '-',
        label: relatedDoc ? <CollectionIconLink relatedDoc={relatedDoc} /> : '-',
      },
      // {
      //   raw: estimatedRevenues,
      //   label: estimatedRevenues ? (
      //     <Money value={estimatedRevenues} />
      //   ) : (
      //     '-'
      //   ),
      // },
    ],
  };
};

export default compose(
  mapProps(({ currentUser, ...props }) => {
    const { promotions = [], proProperties = [] } = currentUser;
    return {
      ...props,
      currentUser,
      propertyIds: proProperties.map(({ _id }) => _id),
      promotionIds: promotions.map(({ _id }) => _id),
    };
  }),
  withSmartQuery({
    query: proLoans,
    params: ({ propertyIds, promotionIds }) => ({
      promotionId: { $in: promotionIds },
      propertyId: { $in: propertyIds },
    }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
  withProps(({ loans, currentUser }) => ({
    rows: loans.map(makeMapLoan(currentUser)),
    columnOptions,
  })),
);
