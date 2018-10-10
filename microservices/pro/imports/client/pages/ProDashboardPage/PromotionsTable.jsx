// @flow
import React from 'react';

import Table from 'core/components/Table';
import PromotionsTableContainer from './PromotionsTableContainer';

type PromotionsTableProps = {};

const PromotionsTable = ({ rows, columnOptions }: PromotionsTableProps) => (
  <Table rows={rows} columnOptions={columnOptions} />
);

export default PromotionsTableContainer(PromotionsTable);
