// @flow
import React from 'react';
import PDFTable from '../utils/PDFTable';

type LoanBankOfferProps = {};

const loanRatesTable = () => (
  <PDFTable
    className="loan-bank-pdf-financing-form-loan-rates"
    array={[
      {
        label: 'Taux',
        data: ['Standard', 'Avec contrepartie'],
      },
      {
        label: 'Libor',
        data: [null, null],
        style: { borderBottom: '1px solid black', width: '40%' },
      },
      {
        label: '5 ans',
        data: [null, null],
        style: { borderBottom: '1px solid black', width: '40%' },
      },
      {
        label: '10 ans',
        data: [null, null],
        style: { borderBottom: '1px solid black', width: '40%' },
      },
      {
        label: '15 ans',
        data: [null, null],
        style: { borderBottom: '1px solid black', width: '40%' },
      },
      {
        label: '20 ans',
        data: [null, null],
        style: { borderBottom: '1px solid black', width: '40%' },
      },
    ]}
  />
);

const LoanBankOffer = (props: LoanBankOfferProps) => (
  <div className="loan-bank-pdf-financing">
    <PDFTable
      className="loan-bank-pdf-financing-form"
      array={[
        {
          label: "Date de l'offre",
          data: null,
          style: { borderBottom: '1px solid black', width: '60%' },
        },
        {
          label: 'Nom du prêteur',
          data: null,
          style: { borderBottom: '1px solid black', width: '60%' },
        },
        {
          label: 'Nom du conseiller',
          data: null,
          style: { borderBottom: '1px solid black', width: '60%' },
        },
        {
          label: 'Prêt hypothécaire max',
          data: null,
          style: { borderBottom: '1px solid black', width: '60%' },
        },
        {
          label: 'Amortissement',
          data: null,
          style: { borderBottom: '1px solid black', width: '60%' },
        },
        {
          label: 'Taux hypothécaire',
        },
        {
          label: '\u00A0',
          data: loanRatesTable(),
        },
        {
          label: 'Contrepartie',
          data: null,
          style: { borderBottom: '1px solid black', width: '60%' },
        },
        {
          label: '\u00A0',
          data: null,
          style: { borderBottom: '1px solid black', width: '60%' },
        },
      ]}
    />
  </div>
);

export default LoanBankOffer;
