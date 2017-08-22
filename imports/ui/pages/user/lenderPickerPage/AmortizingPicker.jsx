import PropTypes from 'prop-types';
import React from 'react';

import { T } from '/imports/ui/components/general/Translation.jsx';
import StrategyChoices from '/imports/ui/components/general/StrategyChoices.jsx';

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

const AmortizingPicker = props =>
  (<article>
    <h2>
      <T id="AmortizingPicker.title" />
    </h2>

    <p className="strategy-description">
      <T id="AmortizingPicker.description" />
    </p>

    <StrategyChoices
      name="amortizationStrategyPreset"
      currentValue={props.formState.amortizationStrategyPreset}
      choices={getChoices()}
      handleChoose={id =>
        props.setFormState(
          'amortizationStrategyPreset',
          id,
          props.scroll(props.index + 1),
        )}
    />
  </article>);

AmortizingPicker.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  scroll: PropTypes.func.isRequired,
};

export default AmortizingPicker;
