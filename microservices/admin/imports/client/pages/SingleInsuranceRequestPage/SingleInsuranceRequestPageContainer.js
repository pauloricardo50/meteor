import { compose, withProps } from 'recompose';
import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';
import { adminRevenue, adminBorrower } from 'core/api/fragments';

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
      borrowers: adminBorrower(),
      adminNotes: 1,
      proNote: 1,
      proNotes: 1,
      revenues: adminRevenue(),
      insurances: {
        adminNotes: 1,
        proNote: 1,
        proNotes: 1,
        name: 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        description: 1,
        borrower: { name: 1 },
        organisation: {
          name: 1,
          logo: 1,
        },
        premium: 1,
        singlePremium: 1,
        duration: 1,
        billingDate: 1,
        insuranceProduct: {
          name: 1,
          category: 1,
          type: 1,
          revaluationFactor: 1,
        },
        revenues: adminRevenue(),
      },
    }),
    dataName: 'insuranceRequest',
    queryOptions: { reactive: true, single: true },
  }),
);
