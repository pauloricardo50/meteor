import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Button from '/imports/ui/components/general/Button.jsx';
import Scroll from 'react-scroll';

import {
  loanStrategySuccess,
  getLoanValue,
} from '/imports/js/helpers/requestFunctions';
import StrategyChoices from '/imports/ui/components/general/StrategyChoices.jsx';
import FinanceStrategyPicker from './FinanceStrategyPicker.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  callButton: {
    display: 'block',
    width: '100%',
    marginTop: 40,
    marginBottom: 80,
  },
  backButton: {
    marginBottom: 32,
  },
  article: {
    marginBottom: 40,
  },
  choice: {
    display: 'inline-block',
    padding: 20,
    minWidth: 200,
  },
  icon: {
    paddingBottom: 20,
    color: '#D8D8D8',
  },
  picker: {
    marginTop: 40,
    display: 'inline-block',
  },
  hr: {
    display: 'inline-block',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  okButton: {
    marginTop: 32,
    float: 'right',
  },
};

const handleChoose = (id, props) => {
  props.setFormState('loanStrategyPreset', id);
  if (id !== 'manual') {
    props.setFormState('loanTranches', getStructure(id, props));
  }

  props.scroll('myStrategy');
};

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
  },
];

const getStructure = (choiceId, props) => {
  const r = props.loanRequest;
  const loan = getLoanValue(r);
  if (choiceId === 'fixed') {
    return [
      {
        type: 'interest10',
        value: loan,
      },
    ];
  } else if (choiceId === 'fixedLibor') {
    return [
      {
        type: 'interest10',
        value: Math.round(loan * 0.8),
      },
      {
        type: 'interestLibor',
        value: Math.round(loan * 0.2),
      },
    ];
  }

  return false;
};

const LoanStrategyPicker = props =>
  (<article>
    <h2>
      <T id="LoanStrategyPicker.title" />
    </h2>

    <p className="strategy-description">
      <T id="LoanStrategyPicker.description" />
    </p>

    <StrategyChoices
      name="loanStrategyPreset"
      currentValue={props.formState.loanStrategyPreset}
      choices={getChoices()}
      handleChoose={id => handleChoose(id, props)}
    />

    {props.formState.loanStrategyPreset &&
      <div>
        <Scroll.Element name="myStrategy">
          <FinanceStrategyPicker
            loanTranches={props.formState.loanTranches}
            setFormState={props.setFormState}
            loanRequest={props.loanRequest}
            style={styles.picker}
            manual={props.formState.loanStrategyPreset === 'manual'}
          />
        </Scroll.Element>
        <div className="text-center" style={{ margin: '20px 0' }}>
          <Button
            raised
            label="Continuer"
            primary={!props.formState.loanStrategyValidated}
            disabled={
              !loanStrategySuccess(
                props.formState.loanTranches,
                props.loanValue,
              )
            }
            onTouchTap={() =>
              props.setFormState(
                'loanStrategyValidated',
                true,
                props.scroll(props.index + 1),
              )}
          />
        </div>
      </div>}
  </article>);

LoanStrategyPicker.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  scroll: PropTypes.func.isRequired,
  loanValue: PropTypes.number.isRequired,
};

export default LoanStrategyPicker;
