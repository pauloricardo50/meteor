import PropTypes from 'prop-types';
import React from 'react';

import T from 'core/components/Translation';
import { AMORTIZATION_STRATEGY_PRESET } from 'core/api/constants';
import StrategyChoices from '../../components/StrategyChoices';

const getChoices = () => [
  {
    id: AMORTIZATION_STRATEGY_PRESET.INDIRECT,
    title: 'Amortissement Indirect',
    reasons: [
      'Paiements ne changent pas avec les années',
      'Charge fiscale minimale',
      "Établissement d'un 3e pilier",
    ],
    isBest: true,
  },
  {
    id: AMORTIZATION_STRATEGY_PRESET.DIRECT,
    title: 'Amortissement Direct',
    reasons: ['Paiements diminuent avec les années', 'Charge fiscale augmente'],
  },
];

const AmortizingPicker = ({
  loan,
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
      value={loan.logic.amortizationStrategyPreset}
      choices={getChoices()}
      handleChoose={id =>
        handleSave({ 'logic.amortizationStrategyPreset': id })
      }
      disabled={disabled}
    />

    {/* FIXME: Logismata widget, put it back when ready */}
    {/* {!!loan.logic.amortizationStrategyPreset && (
      <AmortizingSummary
        loan={loan}
        borrowers={borrowers}
        offers={offers}
      />
    )} */}
  </article>
);

AmortizingPicker.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default AmortizingPicker;
