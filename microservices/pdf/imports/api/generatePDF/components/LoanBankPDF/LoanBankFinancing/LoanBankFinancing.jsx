// @flow
import React from 'react';
import { T } from 'core/components/Translation/Translation';
import { toMoney } from 'core/utils/conversionFunctions';
import PDFTable from '../utils/PDFTable';

type LoanBankFinancingProps = {
  structures: Array<Object>,
  property: Object,
};

const structureCost = ({ structure: { notaryFees }, propertyValue }) => (
  <div className="loan-bank-pdf-financing-single-structure-cost">
    <PDFTable
      className="loan-bank-pdf-financing-single-structure-cost-table"
      array={[
        {
          label: "Prix d'achat",
          data: `CHF ${toMoney(propertyValue)}`,
        },
        {
          label: 'Frais de notaire',
          data: `CHF ${toMoney(notaryFees)}`,
        },
        {
          label: 'Total',
          data: `CHF ${toMoney(propertyValue + notaryFees)}`,
          style: { fontWeight: 'bold' },
        },
      ]}
    />
  </div>
);

const structureLoan = ({ wantedLoan }) => (
  <div className="loan-bank-pdf-financing-single-structure-loan">
    <PDFTable
      className="loan-bank-pdf-financing-single-structure-loan-table"
      array={[
        {
          label: 'Prêt hypothécaire',
          data: `CHF ${toMoney(wantedLoan)}`,
        },
      ]}
    />
  </div>
);

const structureOwnFunds = ownFunds => (
  <div className="loan-bank-pdf-financing-single-structure-own-funds">
    <PDFTable
      className="loan-bank-pdf-financing-single-structure-own-funds-table"
      array={ownFunds.map(({ type, usageType, value }) => ({
        label: usageType ? `${usageType} ${type}` : type,
        data: `CHF ${toMoney(value)}`,
      }))}
    />
  </div>
);

const renderStructure = ({ structure, propertyValue }) => (
  <div className="loan-bank-pdf-financing-single-structure">
    {structureCost({ structure, propertyValue })}
    {structureLoan(structure)}
    {structureOwnFunds(structure.ownFunds)}
  </div>
);

const LoanBankFinancing = ({
  structures,
  property,
}: LoanBankFinancingProps) => (
  <div className="loan-bank-pdf-financing">
    <h3 className="loan-bank-pdf-section-title">
      <T id="PDF.sectionTitle.financing" />
    </h3>
    <div className="loan-bank-pdf-financing-recap">
      {structures.map(structure =>
        renderStructure({ structure, propertyValue: property.value }))}
    </div>
  </div>
);

export default LoanBankFinancing;
