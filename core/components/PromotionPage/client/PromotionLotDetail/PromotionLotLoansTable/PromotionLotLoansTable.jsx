import React from 'react';

import { LOAN_STATUS } from '../../../../../api/loans/loanConstants';
import MongoSelect from '../../../../Select/MongoSelect';
import Table from '../../../../Table';
import T from '../../../../Translation';
import PromotionLotLoansTableContainer from './PromotionLotLoansTableContainer';

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
      initialOrderBy="status" // By status
      className="promotion-lot-loans-table"
    />
  </>
);

export default PromotionLotLoansTableContainer(PromotionLotLoansTable);
