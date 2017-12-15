import React from 'react';
import PropTypes from 'prop-types';

import SummaryComponent from '/imports/ui/components/general/SummaryComponent';
import { T } from 'core/components/Translation';
import Logismata from '/imports/ui/components/general/Logismata';

import AmortizationCalculator from './AmortizationCalculator';

const AmortizingSummary = ({ loanRequest, borrowers, offers }) => {
  const choice = loanRequest.logic.amortizationStrategyPreset;

  return (
    <SummaryComponent>
      <p>
        <T id={`AmortizingSummary.${choice}.description`} />
      </p>
      <Logismata>
        <AmortizationCalculator
          loanRequest={loanRequest}
          borrowers={borrowers}
          offers={offers}
        />
      </Logismata>
    </SummaryComponent>
  );
};

AmortizingSummary.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AmortizingSummary;
