import React from 'react';

import { LOAN_STATUS } from '../../../../api/loans/loanConstants';
import DataTable from '../../../DataTable';
import Select from '../../../Select';
import MongoSelect from '../../../Select/MongoSelect';
import T from '../../../Translation';
import PromotionCustomersTableContainer from './PromotionCustomersTableContainer';

const PromotionCustomersTable = ({
  status,
  setStatus,
  invitedBy,
  setInvitedBy,
  dataTableProps = {},
  promotion: { users = [] },
}) => (
  <>
    <div className="flex mb-16">
      <MongoSelect
        value={status}
        onChange={setStatus}
        options={LOAN_STATUS}
        id="status"
        label={<T id="Forms.status" />}
        className="mr-8"
      />

      <Select
        value={invitedBy}
        onChange={setInvitedBy}
        options={[
          { id: null, label: <T id="general.all" /> },
          ...users.map(({ _id, name, organisations }) => ({
            id: _id,
            label: name,
            organisations,
          })),
        ]}
        label={<T id="Forms.invitedBy" />}
        displayEmpty
        notched
        InputLabelProps={{ shrink: true }}
        grouping={{ groupBy: 'organisations.0.name' }}
      />
    </div>
    <DataTable {...dataTableProps} />
  </>
);

export default PromotionCustomersTableContainer(PromotionCustomersTable);
