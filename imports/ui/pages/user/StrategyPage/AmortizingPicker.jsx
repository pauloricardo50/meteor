import PropTypes from 'prop-types';
import React from 'react';

import { T } from '/imports/ui/components/general/Translation';
import StrategyChoices from '/imports/ui/components/general/StrategyChoices';

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

const AmortizingPicker = ({ loanRequest, handleSave }) =>
  (<article>
    <h2>
      <T id="AmortizingPicker.title" />
    </h2>

    <p className="strategy-description">
      <T id="AmortizingPicker.description" />
    </p>

    <StrategyChoices
      name="amortizationStrategyPreset"
      currentValue={loanRequest.logic.amortizationStrategyPreset}
      choices={getChoices()}
      handleChoose={id =>
        handleSave({ 'logic.amortizationStrategyPreset': id })}
    />
  </article>);

AmortizingPicker.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default AmortizingPicker;
