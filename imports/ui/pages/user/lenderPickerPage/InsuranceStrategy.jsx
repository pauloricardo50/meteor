import PropTypes from 'prop-types';
import React from 'react';

import StrategyChoices from '/imports/ui/components/general/StrategyChoices.jsx';
import RaisedButton from 'material-ui/RaisedButton';

const getChoices = () => {
  return [
    {
      id: 'collateral',
      title: 'Nantissement',
      reasons: [
        'Dette plus élevée',
        'Amortissement plus élevé',
        'Croissance du capital prévoyance préservée',
      ],
      isBest: true,
    },
    {
      id: 'withdrawal',
      title: 'Retrait',
      reasons: [
        'Dette plus basse',
        'Impôts de retrait anticipés',
        'Perte des gains annuels du capital prévoyance',
      ],
    },
  ];
};

const InsuranceStrategy = props => {
  return (
    <article>
      <h2>{props.index}. Stratégie de prévoyance</h2>

      <div className="description">
        <p>
          Vous avez décidé d'utiliser votre prévoyance pour ce projet. Il faut encore décider par quel mécanisme financier vous allez le faire.
          <br /><br />
          <div className="text-center">
            <RaisedButton label="En savoir plus" primary />
          </div>
        </p>
      </div>

      <StrategyChoices
        currentValue={props.formState.insuranceUsePreset}
        choices={getChoices()}
        handleChoose={id =>
          props.setFormState('insuranceUsePreset', id, props.scroll(props.index + 1))}
      />

    </article>
  );
};

InsuranceStrategy.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  scroll: PropTypes.func.isRequired,
};

export default InsuranceStrategy;
