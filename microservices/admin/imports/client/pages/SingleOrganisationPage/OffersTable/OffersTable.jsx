//      
import React from 'react';
import Table from 'core/components/Table';
import OfferRecapDialog from 'core/components/OfferRecapDialog';
import OffersTableContainer from './OffersTableContainer';

                         
                      
                               
                      
                           
  

const OffersTable = ({
  rows,
  columnOptions,
  setOfferDialog,
  offerDialog,
}                  ) => (
  <>
    <Table columnOptions={columnOptions} rows={rows} clickable />
    <OfferRecapDialog
      setOfferDialog={setOfferDialog}
      offerDialog={offerDialog}
    />
  </>
);

export default OffersTableContainer(OffersTable);
