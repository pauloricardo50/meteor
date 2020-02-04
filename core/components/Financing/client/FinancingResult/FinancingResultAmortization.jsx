//      
import React from 'react';

// import Calculator from '../../../../utils/Calculator';
import T, { Money } from '../../../Translation';
import Icon from '../../../Icon';
import { CalculatedValue } from '../FinancingSection/components';

const AmortizationTooltip = ({ Calculator, loan, structureId }) => {
  const amortizationAmount = Calculator.getTotalAmortization({
    loan,
    structureId,
  });
  const amortizationYears = Calculator.getAmortizationDuration({
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

                                           

const FinancingResultAmortization = ({
  className,
  ...props
}                                  ) => (
  <div className={className}>
    <CalculatedValue {...props} />
    <Icon
      type="info"
      tooltip={<AmortizationTooltip {...props} />}
      tooltipPlacement="right"
    />
  </div>
);

export default FinancingResultAmortization;
