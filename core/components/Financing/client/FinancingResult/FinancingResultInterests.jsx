import React from 'react';

import Calculator from '../../../../utils/Calculator';
import T, { Percent } from '../../../Translation';
import Icon from '../../../Icon';
import { CalculatedValue } from '../FinancingSection/components';
import { getInterestRates } from '../FinancingCalculator';

const getTooltipTitle = ({ structure, loan, structureId }) => {
  const { offerId } = structure;

  if (offerId) {
    const offer = Calculator.selectOffer({
      loan,
      structureId,
    });
    return (
      <T
        id="FinancingResultInterests.withOffer"
        values={{ name: offer.organisation.name }}
      />
    );
  }

  return <T id="FinancingResultInterests.noOffer" />;
};

const InterestsTooltip = props => {
  const { loanTranches } = props.structure;
  const rates = getInterestRates(props);

  return (
    <div>
      <h4 className="inherit-color" style={{ marginTop: 0 }}>
        {getTooltipTitle(props)}
      </h4>
      {loanTranches.map(({ type }) => {
        const rate = rates[type];

        return (
          <div key={type}>
            <b>
              <T id={`offer.${type}.short`} />
            </b>
            &nbsp;
            <Percent value={rate} />
          </div>
        );
      })}
    </div>
  );
};

const FinancingResultInterests = ({ className, ...props }) => (
  <div className={className}>
    <CalculatedValue {...props} />
    <Icon
      type="info"
      tooltip={<InterestsTooltip {...props} />}
      tooltipPlacement="right"
    />
  </div>
);
export default FinancingResultInterests;
