// @flow
import React from 'react';

import MoneyRange from './MoneyRange';

type SolvencyCalculatorResultsTableProps = {
  min: Object,
  max: Object,
};

const SolvencyCalculatorResultsTable = ({
  min,
  max,
}: SolvencyCalculatorResultsTableProps) => {
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
        <td>
          <h4>
            <MoneyRange min={minLoan} max={maxLoan} />
          </h4>
        </td>
      </tr>
      <tr>
        <td>
          <h4 className="secondary">Fonds propres</h4>{' '}
        </td>
        <td>
          <h4>
            <MoneyRange min={minOwnFunds} max={maxOwnFunds} />
          </h4>
        </td>
      </tr>
      <tr>
        <td>
          <h4 className="secondary">Prix d'achat max.</h4>
        </td>
        <td>
          <h3>
            <MoneyRange min={minPropertyValue} max={maxPropertyValue} />
          </h3>
        </td>
      </tr>
    </table>
  );
};

export default SolvencyCalculatorResultsTable;
