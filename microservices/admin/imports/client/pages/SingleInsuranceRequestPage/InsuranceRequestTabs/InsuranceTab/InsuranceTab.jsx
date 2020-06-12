import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';

import { getInsuranceDocuments } from 'core/api/files/documents';
import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';
import { insuranceUpdateStatus } from 'core/api/insurances/methodDefinitions';
import { REVENUE_TYPES } from 'core/api/revenues/revenueConstants';
import SingleFileTab from 'core/components/FileTabs/SingleFileTab';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';

import RevenuesTable from '../../../../components/RevenuesTable';
import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';
import InsuranceEstimatedRevenue from './InsuranceEstimatedRevenue';
import InsuranceModifier from './InsuranceModifier';
import InsuranceRemover from './InsuranceRemover';

const InsuranceTab = props => {
  const {
    insurance,
    insuranceRequest,
    currentUser,
    referralOrganisation,
    referralIsCommissionned,
  } = props;
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
              organisationLinks: referralIsCommissionned
                ? [
                    {
                      _id: referralOrganisation._id,
                      commissionRate: referralOrganisation.commissionRate,
                    },
                  ]
                : [],
            }}
            buttonProps={{ className: 'ml-8' }}
          />
        </h3>
        {revenues.length ? (
          <RevenuesTable
            insurance={insurance}
            filterRevenues={({ insurance: { _id: insuranceId } }) => ({
              'insuranceCache._id': insuranceId,
            })}
          />
        ) : (
          <InsuranceEstimatedRevenue
            insurance={insurance}
            insuranceRequest={insuranceRequest}
            referralOrganisation={referralOrganisation}
            referralIsCommissionned={referralIsCommissionned}
          />
        )}
      </div>

      <div className="insurance-modifier flex-col card1 p-16">
        <h3 className="mt-0 mb-32 flex center-align">
          <span className="mr-8">{insurance.name}</span>
          <StatusLabel
            collection={INSURANCES_COLLECTION}
            status={insurance?.status}
            allowModify
            docId={insurance?._id}
            method={status =>
              insuranceUpdateStatus.run({ insuranceId: insurance?._id, status })
            }
          />
        </h3>
        <div className="flex-row sa">
          <InsuranceRemover
            insuranceId={insurance._id}
            insuranceRequestId={insuranceRequest._id}
          />
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
              withAdditionalDocAdder={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceTab;
