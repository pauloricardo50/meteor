import React from 'react';

import Icon from '../../../Icon';
import T, { Money, Percent } from '../../../Translation';
import { CalculatedValue } from '../FinancingSection/components';

const AmortizationTooltip = ({ Calculator, loan, structureId }) => {
  const amortizationAmount = Calculator.getTotalAmortization({
    loan,
    structureId,
  });
  const amortizationYears = Calculator.getAmortizationYears({
    loan,
    structureId,
  });
  const yearlyAmortization =
    Calculator.getAmortization({
      loan,
      structureId,
    }) * 12;

  return (
    <div>
      {amortizationAmount > 0 && (
        <>
          <div>
            <span>
              <T id="FinancingResultAmortization.total" />
            </span>
            :&nbsp;
            <b>
              <Money value={amortizationAmount} />
            </b>
          </div>

          <div>
            <span>
              <T id="FinancingResultAmortization.duration" />
            </span>
            :&nbsp;
            <b>
              {amortizationYears} <T id="general.years" />
            </b>
          </div>

          <div>
            <span>
              <T id="FinancingResultAmortization.yearly" />
            </span>
            :&nbsp;
            <b>
              <Money value={yearlyAmortization} />
              /
              <T id="general.year" />
            </b>
          </div>
        </>
      )}
      {(!amortizationAmount || amortizationAmount < 0) && (
        <T id="FinancingResultAmortization.none" />
      )}
    </div>
  );
};

const FinancingResultAmortization = ({ className, ...props }) => {
  const { Calculator, loan, structureId, value } = props;
  const loanValue = Calculator.selectLoanValue({
    loan,
    structureId,
  });

  return (
    <div className={className}>
      <CalculatedValue {...props} />
      <span className="secondary">
        &nbsp;(
        <Percent value={(value(props) * 12) / loanValue} /> par an)&nbsp;
      </span>
      <Icon
        type="info"
        tooltip={<AmortizationTooltip {...props} />}
        tooltipPlacement="right"
      />
    </div>
  );
};

export default FinancingResultAmortization;
