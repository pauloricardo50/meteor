import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

import { REVENUE_TYPES } from 'core/api/constants';
import RevenuesTable from '../../../../components/RevenuesTable';
import RevenueAdder from '../../../../components/RevenuesTable/RevenueAdder';

const RevenuesTab = ({ insuranceRequest }) => {
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
          }}
          buttonProps={{ className: 'ml-8' }}
        />
      </h3>
      <RevenuesTable
        insuranceRequest={insuranceRequest}
        filterRevenues={({ insuranceRequest: { _id } }) => ({
          'insuranceRequestCache.0._id': _id,
        })}
        firstColumnLabel="Assurance"
      />
    </div>
  );
};

export default RevenuesTab;
