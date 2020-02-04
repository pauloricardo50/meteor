//      
import React from 'react';

import Table from '../Table';
import PromotionsTableContainer from './PromotionsTableContainer';

                               

export const PromotionsTable = ({
  rows,
  columnOptions,
}                      ) => <Table rows={rows} columnOptions={columnOptions} />;

export default PromotionsTableContainer(PromotionsTable);
