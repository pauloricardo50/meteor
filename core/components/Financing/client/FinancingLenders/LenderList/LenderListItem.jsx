// @flow
import React from 'react';

import PercentWithStatus from '../../../../PercentWithStatus';
import { Calculator } from '../../../../../utils/Calculator';
import { Money } from '../../../../Translation';

type LenderListItemProps = {};

const LenderListItem = ({
  organisation: { name, lenderRules, logo },
  loan,
  structureId,
}: LenderListItemProps) => {
  const calc = new Calculator({ loan, structureId, lenderRules });
  const incomeRatio = calc.getIncomeRatio({ loan, structureId });
  const totalIncome = calc.getTotalIncome({ loan });
  const expenses = calc.getTheoreticalMonthly({ loan, structureId }) * 12;

  return (
    <div className="lender-list-item">
      <h4>{name}</h4>
      <div className="lender-list-item-data">
        <div>
          <span>Taux d'effort</span>
          <div className="percent">
            <PercentWithStatus value={incomeRatio} status="SUCCESS" />
          </div>
        </div>
        <div>
          <span>Revenus</span>
          <Money value={totalIncome} />
        </div>
        <div>
          <span>Charges</span>
          <Money value={expenses} />
        </div>
      </div>
    </div>
  );
};

export default LenderListItem;
