import PropTypes from 'prop-types';
import React from 'react';

import StrategyChoices from '/imports/ui/components/general/StrategyChoices.jsx';

const getChoices = () => {
  return [
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
      reasons: [
        'Paiements diminuent avec les années',
        'Charge fiscale augmente',
        <span>&nbsp;</span>,
      ],
    },
  ];
};

const StrategyAmortization = props => {
  return (
    <article>
      <h2>Choisissez votre stratégie d'amortissement</h2>

      <div className="description">
        <p>
          Choisir comment amortir son bien immobilier peut avoir des conséquences très
          importantes pour votre futur. N'hésitez pas à nous appeler pour prendre cette
          décision en toute confiance.
        </p>
      </div>

      <StrategyChoices
        name="amortizationStrategyPreset"
        currentValue={props.formState.amortizationStrategyPreset}
        choices={getChoices()}
        handleChoose={id =>
          props.setFormState('amortizationStrategyPreset', id, props.scroll(props.index + 1))}
      />

    </article>
  );
};

StrategyAmortization.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  scroll: PropTypes.func.isRequired,
};

export default StrategyAmortization;
