// @flow
import React from 'react';
import Table from 'core/components/Table';
import OfferRecapDialog from 'core/components/OfferRecapDialog';
import OffersTableContainer from './OffersTableContainer';

type OffersTableProps = {
  rows: Array<Object>,
  columnOptions: Array<Object>,
  offerDialog: Object,
  setOfferDialog: Function,
};

const OffersTable = ({
  rows,
  columnOptions,
  setOfferDialog,
  offerDialog,
}: OffersTableProps) => (
  <>
    <Table columnOptions={columnOptions} rows={rows} clickable />
    <OfferRecapDialog
      setOfferDialog={setOfferDialog}
      offerDialog={offerDialog}
    />
  </>
);

export default OffersTableContainer(OffersTable);
