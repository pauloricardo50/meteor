// @flow
import React from 'react';

import Table from '../../Table';
import T from '../../Translation';
import PromotionLotsTableContainer from './PromotionLotsTableContainer';

type PromotionLotsTableProps = {};

const PromotionLotsTable = ({
  rows,
  columnOptions,
}: PromotionLotsTableProps) => (
  <>
    <h3>
      <T id="collections.lots" />
    </h3>
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default PromotionLotsTableContainer(PromotionLotsTable);
