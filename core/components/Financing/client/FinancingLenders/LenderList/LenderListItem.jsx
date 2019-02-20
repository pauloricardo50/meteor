// @flow
import React from 'react';

import PercentWithStatus from '../../../../PercentWithStatus';
import Icon from '../../../../Icon';
import { Calculator } from '../../../../../utils/Calculator';
import T, { Money, Percent } from '../../../../Translation';
import { ERROR, SUCCESS } from '../../../../../api/constants';
import StatusIcon from '../../../../StatusIcon';

type LenderListItemProps = {};

const LenderListItem = ({
  organisation: { name, lenderRules, logo },
  loan,
  structureId,
}: LenderListItemProps) => {
  const calc = new Calculator({ loan, structureId, lenderRules });
  const incomeRatio = calc.getIncomeRatio({ loan, structureId });
  const borrowRatio = calc.getBorrowRatio({ loan, structureId });
  const totalIncome = calc.getTotalIncome({ loan });
  const expenses = calc.getTheoreticalMonthly({ loan, structureId }) * 12;

  return (
    <div className="lender-list-item">
      <h4>{name}</h4>
      <Icon
        type="info"
        className="icon"
        tooltip={(
          <div>
            <div>
              <span>Revenus considérés</span>:&nbsp;
              <Money value={totalIncome} />
            </div>
            <div>
              <span>Charges considérées</span>:&nbsp;
              <Money value={expenses} />
            </div>
          </div>
        )}
      />
      <StatusIcon
        status={incomeRatio > calc.maxIncomeRatio ? ERROR : SUCCESS}
        tooltip={(
          <span>
            Taux d'effort
            <br />
            <Percent value={incomeRatio} />
            <br />
            <T
              id="PercentWithStatus.max"
              values={{ max: <Percent value={calc.maxIncomeRatio} /> }}
            />
          </span>
        )}
      />
      <StatusIcon
        status={borrowRatio > calc.maxBorrowRatio ? ERROR : SUCCESS}
        tooltip={(
          <span>
            Taux d'avance
            <br />
            <Percent value={borrowRatio} />
            <br />
            <T
              id="PercentWithStatus.max"
              values={{ max: <Percent value={calc.maxBorrowRatio} /> }}
            />
          </span>
        )}
      />
    </div>
  );
};

export default LenderListItem;
