// @flow
import React from 'react';

import Table from '../../../Table';
import T from '../../../Translation';
import LotsTableContainer from './LotsTableContainer';

type LotsTableProps = {};

const LotsTable = ({ rows, columnOptions, ...props }: LotsTableProps) => (
  <>
    <h3 className="text-center">
      <T id="PromotionPage.AdditionalLotsTable" />
    </h3>
    <Table rows={rows} columnOptions={columnOptions} {...props} />
  </>
);

export default LotsTableContainer(LotsTable);
