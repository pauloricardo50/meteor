// @flow
import React from 'react';
import Table from 'core/components/Table';
import InterestRatesTableContainer from './InterestRatesTableContainer';
import { ModifyInterestRatesDialogForm } from '../InterestRatesDialogForm';

type InterestRatesTableProps = {
  rows: Array<Object>,
  columnOptions: Array<Object>,
};

const InterestRatesTable = ({
  rows,
  columnOptions,
  showDialog,
  setShowDialog,
  interestRatesToModify,
}: InterestRatesTableProps) => (
  <>
    <Table columnOptions={columnOptions} rows={rows} clickable />
    {interestRatesToModify && (
      <ModifyInterestRatesDialogForm
        interestRatesToModify={interestRatesToModify}
        open={showDialog}
        setOpen={setShowDialog}
      />
    )}
  </>
);

export default InterestRatesTableContainer(InterestRatesTable);
