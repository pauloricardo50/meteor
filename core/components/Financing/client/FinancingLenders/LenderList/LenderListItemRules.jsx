import React from 'react';

import Icon from '../../../../Icon';
import { Calculator } from '../../../../../utils/Calculator';
import T, { Money, Percent } from '../../../../Translation';
import { ERROR, SUCCESS } from '../../../../../api/constants';
import StatusIcon from '../../../../StatusIcon';
import colors from '../../../../../config/colors';

const LenderListItemRules = ({
  organisation: { lenderRules, name },
  loan,
  structureId,
}) => {
  const calc = new Calculator({ loan, structureId, lenderRules });
  const incomeRatio = calc.getIncomeRatio({ loan, structureId });
  const borrowRatio = calc.getBorrowRatio({ loan, structureId });
  const totalIncome = calc.getTotalIncome({ loan });
  const expenses = calc.getTheoreticalMonthly({ loan, structureId }) * 12;

  return (
    <>
      {calc.adminComments && calc.adminComments.length > 0 && (
        <Icon
          type="warning"
          style={{ color: colors.warning }}
          tooltip={
            <ul style={{ padding: 0 }}>
              {calc.adminComments.map(comment => (
                <li key="comment">
                  &bull;
                  {comment}
                </li>
              ))}
            </ul>
          }
        />
      )}

      <Icon
        type="info"
        className="icon"
        style={{ color: '#999' }}
        tooltip={
          <div>
            <div>
              <span>
                <T id="FinancingLenders.consideredIncome" />
              </span>
              :&nbsp;
              <Money value={totalIncome} />
            </div>
            <div>
              <span>
                <T id="FinancingLenders.consideredExpenses" />
              </span>
              :&nbsp;
              <Money value={expenses} />
            </div>
            <ul>
              {calc.matchedRules.map(name => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        }
      />

      <StatusIcon
        status={incomeRatio > calc.maxIncomeRatio ? ERROR : SUCCESS}
        tooltip={
          <span>
            <T id="Financing.incomeRatio" />
            :&nbsp;
            <Percent value={incomeRatio} />
            <br />
            <T
              id="PercentWithStatus.max"
              values={{ max: <Percent value={calc.maxIncomeRatio} /> }}
            />
          </span>
        }
      />

      <StatusIcon
        status={borrowRatio > calc.maxBorrowRatio ? ERROR : SUCCESS}
        tooltip={
          <span>
            <T id="Financing.borrowRatio" />
            :&nbsp;
            <Percent value={borrowRatio} />
            <br />
            <T
              id="PercentWithStatus.max"
              values={{ max: <Percent value={calc.maxBorrowRatio} /> }}
            />
          </span>
        }
      />
    </>
  );
};

export default React.memo(LenderListItemRules);
