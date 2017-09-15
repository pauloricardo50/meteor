import React from 'react';
import PropTypes from 'prop-types';

import SummaryComponent from '/imports/ui/components/general/SummaryComponent';
import { T } from '/imports/ui/components/general/Translation';

const AmortizingSummary = ({ loanRequest }) => {
  const choice = loanRequest.logic.amortizationStrategyPreset;

  return (
    <SummaryComponent>
      <p>
        <T id={`AmortizingSummary.${choice}.description`} />
      </p>
      <div className="flex">XXX</div>
    </SummaryComponent>
  );
};

AmortizingSummary.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AmortizingSummary;
