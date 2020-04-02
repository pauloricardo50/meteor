import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

import { getInsuranceDocuments } from 'core/api/files/documents';
import { REVENUE_TYPES } from 'core/api/constants';

import SingleFileTab from 'core/components/FileTabs/SingleFileTab';
import InsuranceModifier from './InsuranceModifier';
import InsuranceEstimatedRevenue from './InsuranceEstimatedRevenue';
import RevenuesTable from '../../../../components/RevenuesTable';
import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';

const InsuranceTab = props => {
  const { insurance, insuranceRequest, currentUser } = props;
  const {
    revenues = [],
    insuranceProduct: { name: insuranceProductName },
    organisation: { _id: organisationId },
  } = insurance;
  const { assignees = [] } = insuranceRequest;
  const mainAssignee = assignees.find(({ $metadata: { isMain } }) => isMain);

  const [openRevenueAdder, setOpenRevenueAdder] = useState(false);

  return (
    <div className="flex-col">
      <div className="flex-col card1 p-16 mb-32">
        <h3 className="mt-0">
          Revenus
          <RevenueAdder
            open={openRevenueAdder}
            setOpen={setOpenRevenueAdder}
            insurance={insurance}
            revenue={{
              type: REVENUE_TYPES.INSURANCE,
              assigneeLink: { _id: Meteor.userId() || mainAssignee?._id },
              description: insuranceProductName,
              sourceOrganisationLink: { _id: organisationId },
            }}
            buttonProps={{ className: 'ml-8' }}
          />
        </h3>
        {revenues.length ? (
          <RevenuesTable
            insurance={insurance}
            filterRevenues={({ insurance: { _id: insuranceId } }) => ({
              'insuranceCache.0._id': insuranceId,
            })}
          />
        ) : (
          <InsuranceEstimatedRevenue
            insurance={insurance}
            insuranceRequest={insuranceRequest}
          />
        )}
      </div>

      <div className="flex-col card1 p-16">
        <h3 className="mt-0 mb-32">{insurance.name}</h3>
        <div className="flex-row sa">
          <InsuranceModifier
            insuranceRequest={insuranceRequest}
            insurance={insurance}
          />
          <div className="flex-col center-align">
            <h3 className="mt-0">Documents</h3>
            <SingleFileTab
              doc={insurance}
              currentUser={currentUser}
              documentArray={getInsuranceDocuments(
                { id: insurance._id },
                { doc: insurance },
              )}
              collection="insurances"
              withAdditionalDocAdder={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceTab;
