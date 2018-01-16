import PropTypes from 'prop-types';
import React from 'react';

import { T } from 'core/components/Translation';
import StrategyChoices from '/imports/ui/components/StrategyChoices';
import Button from 'core/components/Button';
import { INSURANCE_USE_PRESET } from 'core/api/constants';

const getChoices = () => [
  {
    id: INSURANCE_USE_PRESET.COLLATERAL,
    title: 'Nantissement',
    reasons: [
      'Dette plus élevée',
      'Amortissement plus élevé',
      'Croissance du capital prévoyance préservée',
    ],
    isBest: true,
  },
  {
    id: INSURANCE_USE_PRESET.WITHDRAWAL,
    title: 'Retrait',
    reasons: [
      'Dette plus basse',
      'Impôts de retrait anticipés',
      'Perte des gains annuels du capital prévoyance',
    ],
  },
];

const InsuranceStrategy = ({ loanRequest, handleSave, disabled }) => (
  <article>
    <h2>
      <T id="InsuranceStrategy.title" />
    </h2>

    <p className="strategy-description">
      <T id="InsuranceStrategy.description" />
    </p>

    <StrategyChoices
      name="insuranceUsePreset"
      value={loanRequest.logic.insuranceUsePreset}
      choices={getChoices()}
      handleChoose={id => handleSave({ 'logic.insuranceUsePreset': id })}
      disabled={disabled}
    />
  </article>
);

InsuranceStrategy.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default InsuranceStrategy;
