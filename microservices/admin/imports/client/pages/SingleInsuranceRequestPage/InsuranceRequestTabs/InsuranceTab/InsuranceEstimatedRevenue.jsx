import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave } from '@fortawesome/pro-light-svg-icons/faMoneyBillWave';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import {
  ORGANISATIONS_COLLECTION,
  REVENUE_TYPES,
  INSURANCES_COLLECTION,
} from 'core/api/constants';
import { Money } from 'core/components/Translation';
import Loading from 'core/components/Loading';
import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';
import InsuranceEstimatedRevenueInfos from './InsuranceEstimatedRevenueInfos';

const InsuranceEstimatedRevenue = ({
  insurance: {
    _id: insuranceId,
    premium,
    premiumFrequency,
    organisation: { _id: organisationId },
    insuranceProduct: { name, revaluationFactor, maxProductionYears },
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
    return <Loading small />;
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
        maxProductionYears={maxProductionYears}
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
          description: name,
          amount: estimatedRevenue,
          type: REVENUE_TYPES.INSURANCE,
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
