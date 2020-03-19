import React, { useState } from 'react';
import moment from 'moment';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import {
  ORGANISATIONS_COLLECTION,
  REVENUE_TYPES,
  REVENUE_SECONDARY_TYPES,
  INSURANCE_PRODUCT_TYPES,
} from 'core/api/constants';
import { Money } from 'core/components/Translation';
import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';

const getSecondaryType = ({ category, type }) => {
  switch (type) {
    case INSURANCE_PRODUCT_TYPES.DEATH:
      return category === '3A'
        ? REVENUE_SECONDARY_TYPES.DEATH_3A
        : REVENUE_SECONDARY_TYPES.DEATH_3B;
    case INSURANCE_PRODUCT_TYPES.LIFE:
      return category === '3A'
        ? REVENUE_SECONDARY_TYPES.LIFE_3A
        : REVENUE_SECONDARY_TYPES.LIFE_3B;
    case INSURANCE_PRODUCT_TYPES.DISABILITY:
      return category === '3A'
        ? REVENUE_SECONDARY_TYPES.INCOME_PROTECTION_3A
        : REVENUE_SECONDARY_TYPES.INCOME_PROTECTION_3B;
    default:
  }
};

const getEstimatedRevenue = ({
  premium,
  singlePremium,
  duration,
  revaluationFactor,
  productionRate,
}) => {
  if (singlePremium) {
    return premium * revaluationFactor * productionRate;
  }

  return premium * duration * revaluationFactor * productionRate;
};

const InsuranceEstimatedRevenue = ({ insurance, insuranceRequest }) => {
  const {
    revenues = [],
    premium,
    duration,
    singlePremium,
    organisation: { _id: organisationId },
    insuranceProduct: { revaluationFactor, type, category },
    billingDate,
  } = insurance;

  const { assignees = [] } = insuranceRequest;
  const mainAssignee = assignees.find(({ $metadata: { isMain } }) => isMain);

  const [openRevenueAdder, setOpenRevenueAdder] = useState(false);

  const { loading, data: organisation } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { _id: organisationId },
      productionRate: 1,
    },
    type: 'single',
  });

  if (loading) {
    return null;
  }

  const { productionRate } = organisation;
  const estimatedRevenue = Math.round(
    getEstimatedRevenue({
      premium,
      singlePremium,
      duration,
      revaluationFactor,
      productionRate,
    }),
  );

  return (
    <div
      className="card1 mb-32 flex card-top center-align sb"
      style={{ width: '50%' }}
    >
      <h3 className="mr-8">
        Revenu estimé&nbsp;
        <Money value={estimatedRevenue} />
      </h3>

      <RevenueAdder
        insurance={insurance}
        open={openRevenueAdder}
        setOpen={setOpenRevenueAdder}
        revenue={{
          sourceOrganisationLink: { _id: organisationId },
          amount: estimatedRevenue,
          type: REVENUE_TYPES.INSURANCE,
          secondaryType: getSecondaryType({ category, type }),
          expectedAt: moment(billingDate)
            .endOf('month')
            .add(1, 'month'),
          assigneeLink: { _id: mainAssignee?._id },
        }}
        buttonProps={{
          label: 'Revenu estimé',
          className: 'ml-8',
        }}
      />
    </div>
  );
};

export default InsuranceEstimatedRevenue;
