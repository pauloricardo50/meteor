// @flow
import React from 'react';
import Table from 'core/components/Table';
import Irs10yTableContainer from './Irs10yTableContainer';
import { ModifyIrs10yDialogForm } from '../Irs10yDialogForm';
// import { ModifyInterestRatesDialogForm } from '../InterestRatesDialogForm';

type Irs10yTableProps = {
  rows: Array<Object>,
  columnOptions: Array<Object>,
};

const Irs10yTable = ({
  rows,
  columnOptions,
  showDialog,
  setShowDialog,
  irs10yToModify,
}: Irs10yTableProps) => (
  <>
    <Table columnOptions={columnOptions} rows={rows} clickable />
    {irs10yToModify && (
      <ModifyIrs10yDialogForm
        irs10yToModify={irs10yToModify}
        open={showDialog}
        setOpen={setShowDialog}
      />
    )}
  </>
);

export default Irs10yTableContainer(Irs10yTable);
