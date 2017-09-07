import PropTypes from 'prop-types';
import React from 'react';

import { getLoanValue } from '/imports/js/helpers/requestFunctions';
import StrategyChoices from '/imports/ui/components/general/StrategyChoices';
import { T } from '/imports/ui/components/general/Translation';
import TranchePicker from './TranchePicker';

const getChoices = () => [
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
    children: <TranchePicker />,
  },
];

const getStructure = (choiceId, loanRequest) => {
  const loan = getLoanValue(loanRequest);
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

const handleChoose = (id, loanRequest, handleSave) => {
  if (id === 'manual') {
    handleSave({
      'logic.loanStrategyPreset': id,
    });
  } else {
    console.log(id);
    console.log(getStructure(id, loanRequest));
    handleSave({
      'logic.loanStrategyPreset': id,
      'general.loanTranches': getStructure(id, loanRequest),
    });
  }
};

const LoanStrategyPicker = ({ loanRequest, handleSave }) =>
  (<article>
    <h2>
      <T id="LoanStrategyPicker.title" />
    </h2>

    <p className="strategy-description">
      <T id="LoanStrategyPicker.description" />
    </p>

    <StrategyChoices
      name="loanStrategyPreset"
      currentValue={loanRequest.logic.loanStrategyPreset}
      choices={getChoices()}
      handleChoose={id => handleChoose(id, loanRequest, handleSave)}
    />
  </article>);

LoanStrategyPicker.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default LoanStrategyPicker;
