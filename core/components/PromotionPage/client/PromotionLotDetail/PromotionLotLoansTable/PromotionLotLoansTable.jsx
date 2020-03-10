import React from 'react';

import { LOAN_STATUS } from '../../../../../api/constants';
import MongoSelect from '../../../../Select/MongoSelect';
import Table from '../../../../Table';
import PromotionLotLoansTableContainer from './PromotionLotLoansTableContainer';
import T from '../../../../Translation';

const PromotionLotLoansTable = ({ rows, columnOptions, status, setStatus }) => (
  <>
    <MongoSelect
      value={status}
      onChange={setStatus}
      options={LOAN_STATUS}
      id="status"
      label={<T id="Forms.status" />}
    />
    <Table
      rows={rows}
      columnOptions={columnOptions}
      initialOrderBy={1} // By status
      className="promotion-lot-loans-table"
    />
  </>
);

export default PromotionLotLoansTableContainer(PromotionLotLoansTable);
