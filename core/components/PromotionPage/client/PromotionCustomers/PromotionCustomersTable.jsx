import React from 'react';

import Table, { ORDER } from '../../../Table';
import { LOAN_STATUS } from '../../../../api/constants';
import MongoSelect from '../../../Select/MongoSelect';

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
      initialOrderBy={4}
      initialOrder={ORDER.DESC}
    />
  </>
);

export default PromotionCustomersTableContainer(PromotionCustomersTable);
