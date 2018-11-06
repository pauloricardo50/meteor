// @flow
import React from 'react';

import T from 'core/components/Translation';
import { INTEREST_RATES } from 'core/api/constants';
import PDFTable from '../utils/PDFTable';

type LoanBankOfferProps = {};

const interestRateLine = label => ({
  label,
  data: [null, null],
  style: { borderBottom: '1px solid black', width: '40%' },
});

const interestRatesForm = Object.values(INTEREST_RATES).map(type =>
  interestRateLine(<T id={`InterestsTable.${type}`} />));

const loanRatesTable = () => (
  <PDFTable
    className="loan-bank-pdf-financing-form-loan-rates"
    rows={[
      { label: 'Taux', data: ['Standard', 'Avec contrepartie'] },
      ...interestRatesForm,
    ]}
  />
);

const formLine = label => ({
  label,
  data: null,
  style: { borderBottom: '1px solid black', width: '60%' },
});

const nbsp = '\u00A0';

const offerForm = [
  formLine("Date de l'offre"),
  formLine('Nom du prêteur'),
  formLine('Nom du conseiller'),
  formLine('Prêt hypothécaire max'),
  formLine('Amortissement'),
  { label: 'Taux hypothécaire' },
  { label: nbsp, data: loanRatesTable() },
  formLine('Contrepartie'),
  formLine(nbsp),
];

const LoanBankOffer = (props: LoanBankOfferProps) => (
  <div className="loan-bank-pdf-financing">
    <PDFTable className="loan-bank-pdf-financing-form" rows={offerForm} />
  </div>
);

export default LoanBankOffer;
