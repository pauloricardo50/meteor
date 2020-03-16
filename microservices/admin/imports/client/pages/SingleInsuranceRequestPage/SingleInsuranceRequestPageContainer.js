import { compose, withProps } from 'recompose';
import withMatchParam from 'core/containers/withMatchParam';
import { withSmartQuery } from 'core/api';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';

export default compose(
  withMatchParam('insuranceRequestId'),
  withSmartQuery({
    query: INSURANCE_REQUESTS_COLLECTION,
    params: ({ insuranceRequestId }) => ({
      $filters: { _id: insuranceRequestId },
      name: 1,
      user: { name: 1 },
      status: 1,
      assigneeLinks: 1,
      assignees: { name: 1, phoneNumber: 1, email: 1, isMain: 1 },
      borrowers: { name: 1 },
      insurances: {
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        description: 1,
        borrower: { name: 1 },
        organisation: { name: 1 },
        premium: 1,
        singlePremium: 1,
        duration: 1,
        billingDate: 1,
        insuranceProduct: { name: 1, category: 1, type: 1 },
      },
    }),
    dataName: 'insuranceRequest',
    queryOptions: { reactive: true, single: true },
  }),
);
