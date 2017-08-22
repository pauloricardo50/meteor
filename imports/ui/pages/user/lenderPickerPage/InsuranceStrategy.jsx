import PropTypes from 'prop-types';
import React from 'react';

import { T } from '/imports/ui/components/general/Translation.jsx';
import StrategyChoices from '/imports/ui/components/general/StrategyChoices.jsx';
import Button from '/imports/ui/components/general/Button.jsx';

const getChoices = () => [
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

const InsuranceStrategy = props =>
  (<article>
    <h2>
      <T id="InsuranceStrategy.title" />
    </h2>

    <p className="strategy-description">
      <T id="InsuranceStrategy.description" />
    </p>

    <div className="text-center" style={{ width: '100%', marginBottom: 40 }}>
      <Button raised label="En savoir plus" primary />
    </div>

    <StrategyChoices
      name="insuranceUsePreset"
      currentValue={props.formState.insuranceUsePreset}
      choices={getChoices()}
      handleChoose={id =>
        props.setFormState(
          'insuranceUsePreset',
          id,
          props.scroll(props.index + 1),
        )}
    />
  </article>);

InsuranceStrategy.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  scroll: PropTypes.func.isRequired,
};

export default InsuranceStrategy;
