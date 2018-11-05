// @flow
import React from 'react';

import Table from '../Table';
import PromotionsTableContainer from './PromotionsTableContainer';

type PromotionsTableProps = {};

export const PromotionsTable = ({
  rows,
  columnOptions,
}: PromotionsTableProps) => <Table rows={rows} columnOptions={columnOptions} />;

export default PromotionsTableContainer(PromotionsTable);
