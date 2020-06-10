import { Meteor } from 'meteor/meteor';

import React from 'react';

import { LOAN_STATUS } from '../../../../api/loans/loanConstants';
import Checkbox from '../../../Checkbox';
import DataTable from '../../../DataTable';
import MongoSelect from '../../../Select/MongoSelect';
import T from '../../../Translation';
import PromotionCustomersTableContainer from './PromotionCustomersTableContainer';

const isAdmin = Meteor.microservice === 'admin';

const PromotionCustomersTable = ({
  status,
  setStatus,
  queryConfig,
  queryDeps,
  columns,
  initialHiddenColumns,
  invitedBy,
  setInvitedBy,
  promotion: { users = [] },
  currentUser,
}) => (
  <>
    <div className="flex">
      <MongoSelect
        value={status}
        onChange={setStatus}
        options={LOAN_STATUS}
        id="status"
        label={<T id="Forms.status" />}
        className="mr-8"
      />
      {isAdmin ? (
        <MongoSelect
          value={invitedBy}
          onChange={setInvitedBy}
          options={users.map(user => ({
            id: user._id,
            label: user.name,
            ...user,
          }))}
          id="invitedBy"
          label={<T id="PromotionCustomersTable.invitedBy" />}
          className="mr-8"
          grouping={{ groupBy: 'organisations.0.name' }}
        />
      ) : (
        <Checkbox
          label={<T id="PromotionCustomersTable.myCustomers" />}
          value={!!invitedBy}
          onChange={() =>
            setInvitedBy(current => (!current ? currentUser._id : undefined))
          }
        />
      )}
    </div>
    <DataTable
      queryConfig={queryConfig}
      queryDeps={queryDeps}
      columns={columns}
      initialHiddenColumns={initialHiddenColumns}
      initialPageSize={10}
    />
  </>
);

export default PromotionCustomersTableContainer(PromotionCustomersTable);
