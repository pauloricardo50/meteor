import PropTypes from 'prop-types';
import React from 'react';

import { T } from 'core/components/Translation';
import StrategyChoices from '/imports/ui/components/StrategyChoices';

// import AmortizingSummary from './AmortizingSummary';

const getChoices = () => [
  {
    id: 'indirect',
    title: 'Amortissement Indirect',
    reasons: [
      'Paiements ne changent pas avec les années',
      'Charge fiscale minimale',
      "Établissement d'un 3e pilier",
    ],
    isBest: true,
  },
  {
    id: 'direct',
    title: 'Amortissement Direct',
    reasons: ['Paiements diminuent avec les années', 'Charge fiscale augmente'],
  },
];

const AmortizingPicker = ({
  loanRequest,
  borrowers,
  offers,
  handleSave,
  disabled,
}) => (
  <article>
    <h2>
      <T id="AmortizingPicker.title" />
    </h2>

    <p className="strategy-description">
      <T id="AmortizingPicker.description" />
    </p>

    <StrategyChoices
      name="amortizationStrategyPreset"
      value={loanRequest.logic.amortizationStrategyPreset}
      choices={getChoices()}
      handleChoose={id =>
        handleSave({ 'logic.amortizationStrategyPreset': id })
      }
      disabled={disabled}
    />

    {/* FIXME: Logismata widget, put it back when ready */}
    {/* {!!loanRequest.logic.amortizationStrategyPreset && (
      <AmortizingSummary
        loanRequest={loanRequest}
        borrowers={borrowers}
        offers={offers}
      />
    )} */}
  </article>
);

AmortizingPicker.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default AmortizingPicker;
