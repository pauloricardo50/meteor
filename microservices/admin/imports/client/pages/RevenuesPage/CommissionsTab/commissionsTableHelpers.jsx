import React from 'react';
import moment from 'moment';

import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from 'core/api/organisations/organisationConstants';
import { REVENUES_COLLECTION } from 'core/api/revenues/revenueConstants';
import {
  getCommissionFilters,
  getProCommissionDate,
  getProCommissionStatus,
} from 'core/api/revenues/revenueHelpers';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import T, { Money, Percent } from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import CommissionsConsolidator from '../../../components/RevenuesTable/CommissionConsolidator';

export const formatRevenue = revenue => {
  const { loan, insurance } = revenue;
  const user = loan ? loan.user : insurance?.user;
  const name = loan ? loan.name : insurance?.name;

  return { ...revenue, user, name };
};

export const mapRevenueIntoCommissions = ({
  _id: revenueId,
  organisations,
  status: revenueStatus,
  user,
  name,
  expectedAt,
  paidAt: revenuePaidAt,
  amount,
  loan,
  insuranceRequest,
}) =>
  organisations.map(organisation => {
    const {
      _id,
      name: organisationName,
      $metadata: { commissionRate, status: commissionStatus, paidAt },
    } = organisation;
    const status = getProCommissionStatus(revenueStatus, commissionStatus);
    const date = getProCommissionDate({
      revenueStatus,
      commissionStatus,
      expectedAt,
      revenuePaidAt,
      commissionPaidAt: paidAt,
    });
    const commissionAmount = commissionRate * amount;
    return {
      id: revenueId + _id,
      commissionAmount,
      columns: [
        {
          raw: organisationName,
          label: <CollectionIconLink relatedDoc={organisation} />,
        },
        {
          raw: user?.referredByUser?.name,
          label: user?.referredByUser?.name && (
            <CollectionIconLink
              relatedDoc={{
                ...user.referredByUser,
                collection: USERS_COLLECTION,
              }}
            />
          ),
        },
        { raw: status, label: <T id={`Forms.status.${status}`} /> },
        { raw: date?.getTime(), label: moment(date).format('D MMMM YYYY') },
        {
          raw: name,
          label: <CollectionIconLink relatedDoc={loan || insuranceRequest} />,
        },
        { raw: commissionRate, label: <Percent value={commissionRate} /> },
        { raw: commissionAmount, label: <Money value={commissionAmount} /> },
        <CommissionsConsolidator
          revenueId={revenueId}
          amount={amount}
          paidAt={paidAt}
          organisation={organisation}
          commissionRate={commissionRate}
          commissionAmount={commissionAmount}
          key="commissions-consolidator"
        />,
      ],
    };
  });

export const useCommissionsTableData = (proCommissionStatus, orgId) => {
  const { data: orgs = [], loading: loading1 } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { features: ORGANISATION_FEATURES.PRO },
      $options: { sort: { name: 1 } },
      name: 1,
    },
  });
  const { data: revenues = [], loading: loading2 } = useStaticMeteorData(
    {
      query: REVENUES_COLLECTION,
      params: {
        $filters: { $or: getCommissionFilters(proCommissionStatus, orgId) },
        amount: 1,
        expectedAt: 1,
        loan: {
          _id: 1,
          name: 1,
          borrowers: { name: 1 },
          user: { name: 1, referredByUser: { name: 1 } },
          userCache: 1,
          assigneeLinks: 1,
        },
        insuranceRequest: {
          _id: 1,
          name: 1,
          borrowers: { name: 1 },
          user: { name: 1, referredByUser: { name: 1 } },
          userCache: 1,
          assigneeLinks: 1,
        },
        paidAt: 1,
        status: 1,
        organisations: { name: 1 },
      },
    },
    [proCommissionStatus, orgId],
  );

  return { orgs, revenues, loading: loading1 || loading2 };
};
