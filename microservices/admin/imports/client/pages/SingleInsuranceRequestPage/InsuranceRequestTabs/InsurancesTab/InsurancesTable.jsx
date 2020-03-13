import React, { useState } from 'react';
import { withProps } from 'recompose';

import Table from 'core/components/Table';
import moment from 'moment';
import InsuranceModifier from './InsuranceModifier';

const columnOptions = [
  { id: 'status', label: 'Status' },
  { id: 'borrower', label: 'Assuré' },
  { id: 'organisation', label: 'Assurance' },
  { id: 'insuranceProduct', label: 'Produit' },
  { id: 'billingDate', label: 'Décompte du' },
  { id: 'estimatedRevenue', label: 'Revenu estimé' },
];

const makeMapInsurance = (setInsuranceToModify, setShowDialog) => insurance => {
  const {
    _id: insuranceId,
    status,
    borrower,
    organisation,
    insuranceProduct,
    billingDate,
  } = insurance;

  return {
    id: insuranceId,
    columns: [
      { raw: status, label: status },
      { raw: borrower?.name, label: borrower?.name },
      { raw: organisation?.name, label: organisation?.name },
      { raw: insuranceProduct?.name, label: insuranceProduct?.name },
      { raw: billingDate, label: moment(billingDate).format('MMM YYYY') },
      { raw: 1234, label: 1234 },
    ],
    handleClick: () => {
      setInsuranceToModify(insurance);
      setShowDialog(true);
    },
  };
};

const InsurancesTable = ({
  rows = [],
  insuranceRequest,
  insuranceToModify,
  showDialog,
  setShowDialog,
}) => (
  <>
    {rows.length ? (
      <Table columnOptions={columnOptions} rows={rows} />
    ) : (
      <p className="secondary mt-4">Aucune assurance pour l'instant</p>
    )}
    {showDialog && (
      <InsuranceModifier
        noButton
        insurance={insuranceToModify}
        insuranceRequest={insuranceRequest}
        open={showDialog}
        setOpen={setShowDialog}
      />
    )}
  </>
);

export default withProps(({ insuranceRequest: { insurances = [] } }) => {
  const [insuranceToModify, setInsuranceToModify] = useState();
  const [showDialog, setShowDialog] = useState(false);

  return {
    rows: insurances.map(makeMapInsurance(setInsuranceToModify, setShowDialog)),
    insuranceToModify,
    showDialog,
    setShowDialog,
  };
})(InsurancesTable);
