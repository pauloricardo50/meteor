// @flow
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
  const { propertyValue: minPropertyValue, borrowRatio: minBorrowRatio } = min;
  const { propertyValue: maxPropertyValue, borrowRatio: maxBorrowRatio } = max;

  const minLoan = minPropertyValue * minBorrowRatio;
  const maxLoan = maxPropertyValue * maxBorrowRatio;

  const minOwnFunds = minPropertyValue * (1 - minBorrowRatio);
  const maxOwnFunds = maxPropertyValue * (1 - maxBorrowRatio);

  return (
    <table>
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
