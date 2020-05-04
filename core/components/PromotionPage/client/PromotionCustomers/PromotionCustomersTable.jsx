import React from 'react';

import { LOAN_STATUS } from '../../../../api/loans/loanConstants';
import MongoSelect from '../../../Select/MongoSelect';
import Table, { ORDER } from '../../../Table';
import T from '../../../Translation';
import PromotionCustomersTableContainer from './PromotionCustomersTableContainer';

const PromotionCustomersTable = ({
  rows,
  columnOptions,
  status,
  setStatus,
}) => (
  <>
    <MongoSelect
      value={status}
      onChange={setStatus}
      options={LOAN_STATUS}
      id="status"
      label={<T id="Forms.status" />}
      className="mr-8"
    />
    <Table
      rows={rows}
      columnOptions={columnOptions}
      className="promotion-users-table"
      initialOrderBy="createdAt"
      initialOrder={ORDER.DESC}
    />
  </>
);

export default PromotionCustomersTableContainer(PromotionCustomersTable);
