import React from 'react';
import { compose, mapProps, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proLoans from 'core/api/loans/queries/proLoans';
import { getUserNameAndOrganisation } from 'core/api/helpers';
import T, { Money } from 'core/components/Translation';

const columnOptions = [
  { id: 'loanName' },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'referredBy' },
  { id: 'relatedTo' },
  { id: 'estimatedRevenues' },
].map(({ id }) => ({ id, label: <T id={`ProCustomersTable.${id}`} /> }));

const makeMapLoan = history => (loan) => {
  const {
    _id: loanId,
    user,
    createdAt,
    name: loanName,
    relatedTo,
    estimatedRevenues,
  } = loan;

  return {
    id: loanId,
    columns: [
      loanName,
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      {
        raw: user && user.referredByUser,
        label:
          (user
            && user.referredByUser
            && getUserNameAndOrganisation({ user: user.referredByUser }))
          || 'Personne',
      },
      {
        raw: relatedTo,
        label: relatedTo || 'Pas de bien immobilier',
      },
      {
        raw: estimatedRevenues,
        label: estimatedRevenues ? (
          <Money value={estimatedRevenues} />
        ) : (
          'À déterminer'
        ),
      },
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
  withRouter,
  withProps(({ loans, history }) => ({
    rows: loans.map(makeMapLoan(history)),
    columnOptions,
  })),
);
