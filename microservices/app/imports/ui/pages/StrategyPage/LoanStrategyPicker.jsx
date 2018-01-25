import PropTypes from 'prop-types';
import React from 'react';

import { getLoanValue } from 'core/utils/requestFunctions';
import StrategyChoices from '/imports/ui/components/StrategyChoices';
import { T } from 'core/components/Translation';
import TranchePicker from './TranchePicker';
import LenderSummary from './LenderSummary';

const getChoices = ({ loanRequest, offers }) => [
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
    children: <TranchePicker offers={offers} loanRequest={loanRequest} />,
  },
];

const getStructure = ({ choiceId, loanRequest, property }) => {
  const loan = getLoanValue({ loanRequest, property });
  if (choiceId === 'fixed') {
    return [
      {
        type: 'interest10',
        value: loan,
      },
    ];
  }

  return [];
};

const handleChoose = ({ id, loanRequest, handleSave }) => {
  if (id === 'manual') {
    handleSave({
      'logic.loanStrategyPreset': id,
    });
  } else {
    handleSave({
      'logic.loanStrategyPreset': id,
      'general.loanTranches': getStructure({ choiceId: id, loanRequest }),
    });
  }
};

const LoanStrategyPicker = (props) => {
  const {
    loanRequest, handleSave, offers, disabled,
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
        value={loanRequest.logic.loanStrategyPreset}
        choices={getChoices(props)}
        handleChoose={id => handleChoose({ ...props, id })}
        disabled={disabled}
      />

      <p className="secondary">
        <small>
          <T id="LoanStrategyPicker.disclaimer" />
        </small>
      </p>

      {loanRequest.logic.loanStrategyPreset && <LenderSummary />}
    </article>
  );
};

LoanStrategyPicker.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSave: PropTypes.func.isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LoanStrategyPicker;
