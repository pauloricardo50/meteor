import React from 'react';
import PropTypes from 'prop-types';

import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/helpers/textMasks';
import { getFortune, getInsuranceFortune } from '/imports/js/helpers/finance-math';

import { T } from '/imports/ui/components/general/Translation.jsx';

const getArray = (borrowers, showInsurance) => [
  {
    labelText: <T id="general.savings" />,
    id: 'fortuneUsed',
    sliderIncrement: 0,
    max: getFortune(borrowers),
  },
  ...(showInsurance
    ? [
      {
        labelText: <T id="general.insuranceFunds" />,
        id: 'insuranceFortuneUsed',
        sliderIncrement: 0,
        max: getInsuranceFortune(borrowers),
      },
    ]
    : []),
];

const inRange = (min, max, val) => Math.max(min, Math.min(max, val));

const styles = {
  div: {
    padding: '0 40px',
    maxWidth: 800,
    margin: '0 auto',
  },
  slider: {
    marginBottom: 0,
  },
};

const StructureSliders = props => {
  const showInsurance =
    props.loanRequest.property.usageType === 'primary' && getInsuranceFortune(props.borrowers) > 0;

  return (
    <div>
      {getArray(props.borrowers, showInsurance).map(
        item =>
          item.max &&
          <h1 key={item.id} style={styles.div}>
            <TextField
              id={item.id}
              floatingLabelText={item.labelText}
              onChange={e => props.handleChange(e.target.value, item.id)}
              disabled={props.disabled}
            >
              <MaskedInput
                value={inRange(0, item.max, props.parentState[item.id])}
                mask={swissFrancMask}
                guide
                pattern="[0-9]*"
              />
            </TextField>
            <Slider
              value={props.parentState[item.id]}
              min={0}
              max={item.max}
              onChange={(e, v) => props.handleChange(v, item.id)}
              style={styles.slider}
              disabled={props.disabled}
            />
          </h1>,
      )}
    </div>
  );
};

StructureSliders.propTypes = {};

export default StructureSliders;
