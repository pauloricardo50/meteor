import PropTypes from 'prop-types';
import React from 'react';

import { getLoanValue } from 'core/utils/loanFunctions';
import StrategyChoices from '/imports/ui/components/StrategyChoices';
import { T } from 'core/components/Translation';
import TranchePicker from './TranchePicker';
import LenderSummary from './LenderSummary';

const getChoices = ({ loan, offers }) => [
  {
    id: 'fixed',
    title: '100% Fixé',
    reasons: ['Dormez serein', 'Profitez des taux historiquement bas'],
    isBest: true,
  },
  {
    id: 'manual',
    title: 'Mode Manuel',
    reasons: [
      'Fixez chaque tranche vous-même',
      'Choisissez la durée',
      'À vos risques et périls',
    ],
    children: <TranchePicker offers={offers} loan={loan} />,
  },
];

const getStructure = ({ choiceId, loan, property }) => {
  const loanValue = getLoanValue({ loan, property });
  if (choiceId === 'fixed') {
    return [
      {
        type: 'interest10',
        value: loanValue,
      },
    ];
  }

  return [];
};

const handleChoose = ({ id, loan, handleSave }) => {
  if (id === 'manual') {
    handleSave({
      'logic.loanStrategyPreset': id,
    });
  } else {
    handleSave({
      'logic.loanStrategyPreset': id,
      'general.loanTranches': getStructure({ choiceId: id, loan }),
    });
  }
};

const LoanStrategyPicker = (props) => {
  const {
    loan, handleSave, offers, disabled,
  } = props;
  return (
    <article>
      <h2>
        <T id="LoanStrategyPicker.title" />
      </h2>

      <p className="strategy-description">
        <T id="LoanStrategyPicker.description" />
      </p>

      <StrategyChoices
        name="loanStrategyPreset"
        value={loan.logic.loanStrategyPreset}
        choices={getChoices(props)}
        handleChoose={id => handleChoose({ ...props, id })}
        disabled={disabled}
      />

      <p className="secondary">
        <small>
          <T id="LoanStrategyPicker.disclaimer" />
        </small>
      </p>

      {loan.logic.loanStrategyPreset && <LenderSummary />}
    </article>
  );
};

LoanStrategyPicker.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSave: PropTypes.func.isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LoanStrategyPicker;
