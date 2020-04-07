import React from 'react';

import { ERROR, SUCCESS } from '../../../../../api/constants';
import colors from '../../../../../config/colors';
import { Calculator } from '../../../../../utils/Calculator';
import Icon from '../../../../Icon';
import StatusIcon from '../../../../StatusIcon';
import T, { Money, Percent } from '../../../../Translation';

export const mapOrganisation = ({ loan, structureId, organisation }) => {
  const calc = new Calculator({
    loan,
    structureId,
    lenderRules: organisation.lenderRules,
  });
  const incomeRatio = calc.getIncomeRatio({ loan, structureId });
  const borrowRatio = calc.getBorrowRatio({ loan, structureId });

  return {
    incomeRatio,
    borrowRatio,
    totalIncome: calc.getTotalIncome({ loan }),
    expenses: calc.getTheoreticalMonthly({ loan, structureId }) * 12,
    calc,
    incomeRatioStatus: incomeRatio > calc.maxIncomeRatio ? ERROR : SUCCESS,
    borrowRatioStatus: borrowRatio > calc.maxBorrowRatio ? ERROR : SUCCESS,
  };
};

const LenderListItemRules = ({
  calc,
  incomeRatio,
  borrowRatio,
  totalIncome,
  expenses,
  incomeRatioStatus,
  borrowRatioStatus,
}) => (
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
      status={incomeRatioStatus}
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
      status={borrowRatioStatus}
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

export default React.memo(LenderListItemRules);
