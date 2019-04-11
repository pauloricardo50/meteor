// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import useMedia from 'core/hooks/useMedia';
import Calculator from 'core/utils/Calculator';
import MoneyRange from './MoneyRange';

type MaxPropertyValueResultsTableProps = {
  min: Object,
  max: Object,
};

const MaxPropertyValueResultsTable = ({
  min,
  max,
  residenceType,
  canton,
}: MaxPropertyValueResultsTableProps) => {
  const isSmallMobile = useMedia({ maxWidth: 480 });
  const {
    propertyValue: minPropertyValue,
    borrowRatio: minBorrowRatio,
    organisationName: minOrganisationName,
  } = min;
  const {
    propertyValue: maxPropertyValue,
    borrowRatio: maxBorrowRatio,
    organisationName: maxOrganisationName,
  } = max;

  const minLoan = minPropertyValue * minBorrowRatio;
  const maxLoan = maxPropertyValue * maxBorrowRatio;

  const minNotaryFees = Calculator.getFees({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: minLoan,
      propertyValue: minPropertyValue,
      canton,
    }),
  }).total;
  const maxNotaryFees = Calculator.getFees({
    loan: Calculator.createLoanObject({
      residenceType,
      wantedLoan: maxLoan,
      propertyValue: maxPropertyValue,
      canton,
    }),
  }).total;

  const minOwnFunds = minPropertyValue * (1 - minBorrowRatio) + minNotaryFees;
  const maxOwnFunds = maxPropertyValue * (1 - maxBorrowRatio) + maxNotaryFees;

  return (
    <>
      <div className="flex labels">
        <div className="flex-col">
          <span className="secondary">
            {isSmallMobile ? '- compétitif' : 'Prêteur le - compétitif'}
          </span>
          {Meteor.microservice === 'admin' && (
            <span>[ADMIN] {minOrganisationName}</span>
          )}
        </div>
        <div className="flex-col">
          <span className="secondary">
            {isSmallMobile ? '+ compétitif' : 'Prêteur le + compétitif'}
          </span>
          {Meteor.microservice === 'admin' && (
            <span>[ADMIN] {maxOrganisationName}</span>
          )}
        </div>
      </div>

      <span className="label">Fonds propres</span>
      <MoneyRange min={minOwnFunds} max={maxOwnFunds} />
      <span className="label">Hypothèque</span>
      <MoneyRange
        min={minLoan}
        minRatio={minBorrowRatio}
        max={maxLoan}
        maxRatio={maxBorrowRatio}
      />

      <hr />

      <span className="label">Prix d'achat max.</span>
      <MoneyRange min={minPropertyValue} max={maxPropertyValue} big />

      <span className="label">Frais de notaire</span>
      <MoneyRange min={minNotaryFees} max={maxNotaryFees} />
    </>
  );
};

export default MaxPropertyValueResultsTable;
