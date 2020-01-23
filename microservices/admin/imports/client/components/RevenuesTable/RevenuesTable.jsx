// @flow
import React from 'react';

import Table from 'core/components/Table';
import { Money } from 'core/components/Translation';
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
  initialOrderBy = 1,
}: RevenuesTableProps) => (
  <>
    <RevenueModifier
      loan={loan}
      revenue={revenueToModify}
      open={openModifier}
      setOpen={setOpenModifier}
    />
    <Table
      rows={rows}
      columnOptions={columnOptions}
      initialOrderBy={initialOrderBy}
    />
    {rows.length > 1 && (
      <h2 className="secondary" style={{ textAlign: 'right' }}>
        Total: <Money value={rows.reduce((t, r) => t + r.amount, 0)} />
      </h2>
    )}
  </>
);

export default RevenuesTableContainer(RevenuesTable);
