import React from 'react';
import merge from 'lodash/merge';
import { compose, withProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { formBorrower } from 'core/api/fragments';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { REVENUE_TYPES } from 'core/api/revenues/revenueConstants';
import Loading from 'core/components/Loading/Loading';
import MissingDoc from 'core/components/MissingDoc/MissingDoc';
import withMatchParam from 'core/containers/withMatchParam';
import { useReactiveMeteorData } from 'core/hooks/useMeteorData';

const fullInsuranceRequestFragment = merge(
  {},
  {
    additionalDocuments: 1,
    documents: 1,
    name: 1,
    customName: 1,
    user: { name: 1, referredByOrganisation: { _id: 1 } },
    status: 1,
    assigneeLinks: 1,
    assignees: { name: 1, phoneNumber: 1, email: 1, isMain: 1 },
    borrowers: {
      ...formBorrower(),
      age: 1,
      name: 1,
      $options: { sort: { createdAt: 1 } },
    },
    adminNotes: 1,
    proNote: 1,
    proNotes: 1,
    revenues: {
      amount: 1,
      assigneeLink: 1,
      description: 1,
      expectedAt: 1,
      insurance: { borrower: { name: 1 } },
      insuranceRequest: { name: 1 },
      organisationLinks: 1,
      paidAt: 1,
      sourceOrganisation: { name: 1 },
      sourceOrganisationLink: 1,
      status: 1,
      type: 1,
    },
    insurances: {
      additionalDocuments: 1,
      adminNotes: 1,
      borrower: { name: 1 },
      createdAt: 1,
      deathCapital: 1,
      description: 1,
      disabilityPension: 1,
      documents: 1,
      endDate: 1,
      guaranteedCapital: 1,
      name: 1,
      nonGuaranteedCapital: 1,
      organisation: { name: 1, logo: 1 },
      premium: 1,
      premiumFrequency: 1,
      proNote: 1,
      proNotes: 1,
      startDate: 1,
      status: 1,
      updatedAt: 1,
      insuranceProduct: {
        category: 1,
        features: 1,
        maxProductionYears: 1,
        name: 1,
        revaluationFactor: 1,
      },
    },
    loan: { name: 1 },
    unsuccessfulReason: 1,
  },
);

export default compose(
  withMatchParam('insuranceRequestId'),
  Component => props => <Component {...props} key={props.insuranceRequestId} />,
  Component => props => {
    const { insuranceRequestId, match } = props;
    const _id = insuranceRequestId || match?.params?.insuranceRequestId;

    const { data, loading } = useReactiveMeteorData(
      {
        query: _id && INSURANCE_REQUESTS_COLLECTION,
        params: { $filters: { _id }, ...fullInsuranceRequestFragment },
        type: 'single',
      },
      [_id],
    );

    if (!_id) {
      return null;
    }

    if (loading) {
      return <Loading />;
    }

    if (!data) {
      return <MissingDoc />;
    }

    return <Component {...props} insuranceRequest={data} />;
  },
  withSmartQuery({
    query: ORGANISATIONS_COLLECTION,
    params: ({ insuranceRequest: { user } = {} }) => ({
      $filters: { _id: user?.referredByOrganisation?._id },
      commissionRate: 1,
      enabledCommissionTypes: 1,
    }),
    skip: ({ insuranceRequest }) =>
      !insuranceRequest.user?.referredByOrganisation?._id,
    dataName: 'referralOrganisation',
    queryOptions: { single: true },
    renderMissingDoc: false,
    refetchOnMethodCall: false,
  }),
  withProps(({ referralOrganisation }) => {
    const referralIsCommissionned = referralOrganisation?.enabledCommissionTypes?.includes(
      REVENUE_TYPES.INSURANCE,
    );

    return { referralIsCommissionned };
  }),
);
