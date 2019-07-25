// @flow
import React from 'react';

import Table from 'core/components/Table';
import RevenuesTableContainer from './RevenuesTableContainer';
import RevenueModifier from './RevenueModifier';

type RevenuesTableProps = {};

export const RevenuesTable = ({
  loan,
  rows,
  columnOptions,
  revenueToModify,
  openModifier,
  setOpenModifier,
  initialOrderBy = 1
}: RevenuesTableProps) => (
  <>
    <RevenueModifier
      loan={loan}
      revenue={revenueToModify}
      open={openModifier}
      setOpen={setOpenModifier}
    />
    <Table rows={rows} columnOptions={columnOptions} initialOrderBy={initialOrderBy} />
  </>
);

export default RevenuesTableContainer(RevenuesTable);
