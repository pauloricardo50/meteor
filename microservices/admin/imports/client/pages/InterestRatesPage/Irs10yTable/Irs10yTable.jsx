//      
import React from 'react';
import Table, { ORDER } from 'core/components/Table';
import Irs10yTableContainer from './Irs10yTableContainer';
import { ModifyIrs10yDialogForm } from '../Irs10yDialogForm';
// import { ModifyInterestRatesDialogForm } from '../InterestRatesDialogForm';

                         
                      
                               
  

const Irs10yTable = ({
  rows,
  columnOptions,
  showDialog,
  setShowDialog,
  irs10yToModify,
}                  ) => (
  <>
    <Table
      columnOptions={columnOptions}
      rows={rows}
      clickable
      initialOrder={ORDER.DESC}
    />
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
