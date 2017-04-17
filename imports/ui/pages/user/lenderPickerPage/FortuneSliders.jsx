import PropTypes from 'prop-types';
import React from 'react';

import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

import { getFortune } from '/imports/js/helpers/borrowerFunctions';
import { toMoney } from '/imports/js/helpers/conversionFunctions';

const getMinCash = () => {
  return 0;
};

const getMinInsurance = () => {
  return 0;
};

const isFortuneReady = () => {
  return true;
};

const FortuneSliders = props => {
  return (
    <article>
      <h2>1. Validez vos fonds propres</h2>

      <div
        style={{
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 40px',
        }}
      >
        <h3>
          Fortune utilisée:
          {' '}
          <span className="active">
            CHF {toMoney(props.formState.fortuneUsed)}
          </span>
        </h3>
        <Slider
          value={props.formState.fortuneUsed}
          min={getMinCash()}
          max={getFortune(props.borrowers)}
          step={1000}
          onChange={(e, v) => props.setFormState('fortuneUsed', v)}
        />

        {props.loanRequest.property.usageType === 'primary' &&
          <div>
            <h3>
              Prévoyance utilisée:
              {' '}
              <span className="active">
                CHF {toMoney(props.formState.insuranceFortuneUsed)}
              </span>
            </h3>
            <Slider
              value={props.formState.insuranceFortuneUsed}
              min={getMinInsurance()}
              max={getFortune(props.borrowers)}
              step={1000}
              onChange={(e, v) => props.setFormState('insuranceFortuneUsed', v)}
            />
          </div>}

        <div className="text-center" style={{ margin: '40px 0' }}>
          <RaisedButton
            label="Continuer"
            onTouchTap={() =>
              props.setFormState('validatedFortune', true, () =>
                props.scroll(1))}
            icon={props.formState.validatedFortune && <CheckIcon />}
            primary={!props.formState.validatedFortune}
            disabled={!isFortuneReady(props)}
          />
        </div>
      </div>
    </article>
  );
};

FortuneSliders.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  scroll: PropTypes.func.isRequired,
};

export default FortuneSliders;
