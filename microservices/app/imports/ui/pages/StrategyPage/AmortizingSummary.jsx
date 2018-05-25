import React from 'react';
import PropTypes from 'prop-types';

import SummaryComponent from '/imports/ui/components/SummaryComponent';
import T from 'core/components/Translation';
import Logismata from '/imports/ui/components/Logismata';

import AmortizationCalculator from './AmortizationCalculator';

const AmortizingSummary = ({ loan, borrowers, offers }) => {
  const choice = loan.logic.amortizationStrategyPreset;

  return (
    <SummaryComponent>
      <p>
        <T id={`AmortizingSummary.${choice}.description`} />
      </p>
      <Logismata>
        <AmortizationCalculator
          loan={loan}
          borrowers={borrowers}
          offers={offers}
        />
      </Logismata>
    </SummaryComponent>
  );
};

AmortizingSummary.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AmortizingSummary;
