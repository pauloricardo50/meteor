import React from 'react';
import { compose, withProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { adminBorrower, adminRevenue } from 'core/api/fragments';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { REVENUE_TYPES } from 'core/api/revenues/revenueConstants';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam('insuranceRequestId'),
  Component => props => <Component {...props} key={props.insuranceRequestId} />,
  withSmartQuery({
    query: INSURANCE_REQUESTS_COLLECTION,
    params: ({ insuranceRequestId }) => ({
      $filters: { _id: insuranceRequestId },
      additionalDocuments: 1,
      documents: 1,
      name: 1,
      customName: 1,
      user: { name: 1, referredByOrganisation: { _id: 1 } },
      status: 1,
      assigneeLinks: 1,
      assignees: { name: 1, phoneNumber: 1, email: 1, isMain: 1 },
      borrowers: adminBorrower(),
      adminNotes: 1,
      proNote: 1,
      proNotes: 1,
      revenues: adminRevenue(),
      insurances: {
        additionalDocuments: 1,
        documents: 1,
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
        premiumFrequency: 1,
        startDate: 1,
        endDate: 1,
        insuranceProduct: {
          name: 1,
          category: 1,
          features: 1,
          revaluationFactor: 1,
          maxProductionYears: 1,
        },
        revenues: adminRevenue(),
        guaranteedCapital: 1,
        nonGuaranteedCapital: 1,
        deathCapital: 1,
        disabilityPension: 1,
      },
      loan: { name: 1 },
    }),
    dataName: 'insuranceRequest',
    queryOptions: { reactive: true, single: true },
  }),
  withSmartQuery({
    query: ({ insuranceRequest: { user } = {} }) =>
      user?.referredByOrganisation?._id && ORGANISATIONS_COLLECTION,
    params: ({ insuranceRequest: { user } = {} }) => ({
      $filters: { _id: user?.referredByOrganisation?._id },
      commissionRate: 1,
      enabledCommissionTypes: 1,
    }),
    dataName: 'referralOrganisation',
    queryOptions: { single: true },
    renderMissingDoc: false,
  }),
  withProps(({ referralOrganisation }) => {
    const referralIsCommissionned = referralOrganisation?.enabledCommissionTypes?.includes(
      REVENUE_TYPES.INSURANCE,
    );

    return { referralIsCommissionned };
  }),
);
