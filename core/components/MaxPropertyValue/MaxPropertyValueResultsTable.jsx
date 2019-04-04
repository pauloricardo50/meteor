// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import MoneyRange from './MoneyRange';

type MaxPropertyValueResultsTableProps = {
  min: Object,
  max: Object,
};

const MaxPropertyValueResultsTable = ({
  min,
  max,
}: MaxPropertyValueResultsTableProps) => {
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
    <table>
      <tr>
        <td />
        <td>
          <div className="flex-col">
            <span className="secondary">Prêteur le moins compétitif</span>
            {Meteor.microservice === 'admin' && (
              <span>[ADMIN] {minOrganisationName}</span>
            )}
          </div>
        </td>
        <td />
        <td>
          <div className="flex-col">
            <span className="secondary">Prêteur le plus compétitif</span>
            {Meteor.microservice === 'admin' && (
              <span>[ADMIN] {maxOrganisationName}</span>
            )}
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <h4 className="secondary">Hypothèque</h4>
        </td>
        <MoneyRange
          min={minLoan}
          minRatio={minBorrowRatio}
          max={maxLoan}
          maxRatio={maxBorrowRatio}
        />
      </tr>
      <tr>
        <td>
          <h4 className="secondary">Fonds propres</h4>
        </td>
        <MoneyRange min={minOwnFunds} max={maxOwnFunds} />
      </tr>
      <tr className="money-range-big">
        <td>
          <h3 className="secondary">Prix d'achat max.</h3>
        </td>
        <MoneyRange min={minPropertyValue} max={maxPropertyValue} />
      </tr>
    </table>
  );
};

export default MaxPropertyValueResultsTable;
