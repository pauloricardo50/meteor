// @flow
import React from 'react';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import PropertyCalculator from 'core/utils/Calculator/PropertyCalculator';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';

const todosForLoan = [
  {
    id: 'createStructure',
    condition: ({ structures }) => structures.length === 0,
  },
  {
    id: 'addProperty',
    condition: ({ properties }) => properties.length === 0,
  },
  {
    id: 'completeProperty',
    condition: (loan) => {
      const {
        borrowers,
        structure: { property },
      } = loan;

      if (!property) {
        return false;
      }

      const percent = PropertyCalculator.getPropertyCompletion({
        loan,
        borrowers,
        property,
      });

      if (percent < 1) {
        return true;
      }

      return false;
    },
  },
  {
    id: 'completeBorrowers',
    condition: ({ borrowers }) => {
      const percentages = borrowers.map(borrower =>
        BorrowerCalculator.personalInfoPercent({
          borrowers: borrower,
        }));

      if (percentages.some(percent => percent < 1)) {
        return true;
      }

      return false;
    },
  },
];

const DashboardProgressInfo = ({ loan }) => (
  <div className="dashboard-progress-info">
    {todosForLoan.filter(({ condition }) => condition(loan)).map(({ id }) => (
      <div className="todo" key={id}>
        <Icon className="icon" type="radioButtonChecked" />
        <p>
          <T id={`DashboardProgressInfo.${id}`} />
        </p>
      </div>
    ))}
  </div>
);

DashboardProgressInfo.propTypes = {};

DashboardProgressInfo.defaultProps = {};

export default DashboardProgressInfo;
