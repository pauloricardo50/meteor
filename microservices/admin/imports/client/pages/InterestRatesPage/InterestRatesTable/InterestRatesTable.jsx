import React from 'react';

import Table, { ORDER } from 'core/components/Table';

import { ModifyInterestRatesDialogForm } from '../InterestRatesDialogForm';
import InterestRatesTableContainer from './InterestRatesTableContainer';

const InterestRatesTable = ({
  rows,
  columnOptions,
  showDialog,
  setShowDialog,
  interestRatesToModify,
}) => (
  <>
    <Table
      columnOptions={columnOptions}
      rows={rows}
      clickable
      initialOrder={ORDER.DESC}
    />
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
