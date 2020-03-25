import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/pro-light-svg-icons/faMoneyBillWave';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import {
  ORGANISATIONS_COLLECTION,
  REVENUE_TYPES,
  REVENUE_SECONDARY_TYPES,
  INSURANCE_PRODUCT_TYPES,
  INSURANCES_COLLECTION,
} from 'core/api/constants';
import { Money } from 'core/components/Translation';
import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';
import InsuranceEstimatedRevenueInfos from './InsuranceEstimatedRevenueInfos';

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

const InsuranceEstimatedRevenue = ({
  insurance: {
    _id: insuranceId,
    premium,
    premiumFrequency,
    organisation: { _id: organisationId },
    insuranceProduct: { revaluationFactor, type, category },
  },
  insuranceRequest,
}) => {
  const { assignees = [] } = insuranceRequest;
  const mainAssignee = assignees.find(({ $metadata: { isMain } }) => isMain);

  const [openRevenueAdder, setOpenRevenueAdder] = useState(false);

  const { loading: loadingInsurance, data: insurance } = useStaticMeteorData(
    {
      query: INSURANCES_COLLECTION,
      params: {
        $filters: { _id: insuranceId },
        estimatedRevenue: 1,
        duration: 1,
      },
      type: 'single',
    },
    [insuranceId],
  );

  const { loading: loadingOrg, data: organisation } = useStaticMeteorData(
    {
      query: ORGANISATIONS_COLLECTION,
      params: {
        $filters: { _id: organisationId },
        productionRate: 1,
      },
      type: 'single',
    },
    [insuranceId],
  );

  if (loadingInsurance || loadingOrg) {
    return null;
  }

  const { estimatedRevenue, duration } = insurance;
  const { productionRate } = organisation;

  return (
    <div className="flex-col center-align">
      <FontAwesomeIcon
        icon={faMoneyBillWave}
        style={{ width: '150px', height: '150px', color: 'rgba(0,0,0,0.2)' }}
      />
      <h3 className="secondary">Pas encore de revenus pour cette assurance</h3>
      <p className="description">
        Une estimation du revenu potentiel peut être insérée automatiquement en
        se basant sur les informations suivantes:
      </p>
      <InsuranceEstimatedRevenueInfos
        premium={premium}
        premiumFrequency={premiumFrequency}
        duration={duration}
        revaluationFactor={revaluationFactor}
        productionRate={productionRate}
      />
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
          assigneeLink: { _id: Meteor.userId() || mainAssignee?._id },
        }}
        buttonProps={{
          label: 'Revenu estimé',
          primary: false,
          secondary: true,
        }}
      />
    </div>
  );
};

export default InsuranceEstimatedRevenue;
