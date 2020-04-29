import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';

import { REVENUE_TYPES } from 'core/api/revenues/revenueConstants';

import RevenuesTable from '../../../../components/RevenuesTable';
import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';

const RevenuesTab = ({
  insuranceRequest,
  referralOrganisation,
  referralIsCommissionned,
}) => {
  const [openRevenueAdder, setOpenRevenueAdder] = useState(false);
  const { assignees = [] } = insuranceRequest;
  const mainAssignee = assignees.find(({ $metadata: { isMain } }) => isMain);

  return (
    <div className="flex-col">
      <h3>
        Revenus
        <RevenueAdder
          open={openRevenueAdder}
          setOpen={setOpenRevenueAdder}
          insuranceRequest={insuranceRequest}
          revenue={{
            type: REVENUE_TYPES.INSURANCE,
            assigneeLink: { _id: Meteor.userId() || mainAssignee?._id },
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
      <RevenuesTable
        insuranceRequest={insuranceRequest}
        filterRevenues={({ insuranceRequest: { _id } }) => ({
          'insuranceRequestCache._id': _id,
        })}
        firstColumnLabel="Assurance"
      />
    </div>
  );
};

export default RevenuesTab;
