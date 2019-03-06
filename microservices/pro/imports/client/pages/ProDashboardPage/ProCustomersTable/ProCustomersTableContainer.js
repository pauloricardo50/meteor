import { compose, mapProps, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proLoans from 'core/api/loans/queries/proLoans';
import { getUserNameAndOrganisation } from 'core/api/helpers';

const columnOptions = [
  { id: 'loanName' },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'referredBy' },
  { id: 'relatedTo' },
].map(({ id, label }) => ({ id, label }));

const makeMapLoan = history => (loan) => {
  const { _id: loanId, user, createdAt, name: loanName, relatedTo } = loan;
  console.log('loan:', loan);

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
        label: relatedTo,
      },
    ],
  };
};

export default compose(
  mapProps(({ currentUser, ...props }) => {
    const {
      properties = [],
      promotions = [],
      proProperties = [],
    } = currentUser;
    return {
      ...props,
      currentUser,
      propertyIds: [
        ...properties.map(({ _id }) => _id),
        ...proProperties.map(({ _id }) => _id),
      ],
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
