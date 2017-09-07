import PropTypes from 'prop-types';
import React from 'react';

import { T } from '/imports/ui/components/general/Translation';
import StrategyChoices from '/imports/ui/components/general/StrategyChoices';
import Button from '/imports/ui/components/general/Button';

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

const InsuranceStrategy = ({ loanRequest, handleSave }) =>
  (<article>
    <h2>
      <T id="InsuranceStrategy.title" />
    </h2>

    <p className="strategy-description">
      <T id="InsuranceStrategy.description" />
    </p>

    <StrategyChoices
      name="insuranceUsePreset"
      currentValue={loanRequest.logic.insuranceUsePreset}
      choices={getChoices()}
      handleChoose={id => handleSave({ 'logic.insuranceUsePreset': id })}
    />
  </article>);

InsuranceStrategy.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default InsuranceStrategy;
