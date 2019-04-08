// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import useMedia from 'core/hooks/useMedia';
import MoneyRange from './MoneyRange';

type MaxPropertyValueResultsTableProps = {
  min: Object,
  max: Object,
};

const MaxPropertyValueResultsTable = ({
  min,
  max,
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

  const minOwnFunds = minPropertyValue * (1 - minBorrowRatio);
  const maxOwnFunds = maxPropertyValue * (1 - maxBorrowRatio);

  return (
    <>
      <span className="label">Hypothèque</span>
      <MoneyRange
        min={minLoan}
        minRatio={minBorrowRatio}
        max={maxLoan}
        maxRatio={maxBorrowRatio}
      />
      <span className="label">Fonds propres</span>
      <MoneyRange min={minOwnFunds} max={maxOwnFunds} />
      <span className="label">Prix d'achat max.</span>
      <MoneyRange min={minPropertyValue} max={maxPropertyValue} big />
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
    </>
  );
};

export default MaxPropertyValueResultsTable;
