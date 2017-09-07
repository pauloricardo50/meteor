import React from 'react';
import PropTypes from 'prop-types';

import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/helpers/textMasks';
import {
  getFortune,
  getInsuranceFortune,
} from '/imports/js/helpers/borrowerFunctions';

import { T } from '/imports/ui/components/general/Translation';

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
    marginBottom: 40,
  },
  h1: {
    padding: '0 40px',
    maxWidth: 800,
    margin: '0 auto',
  },
  slider: {
    margin: 0,
  },
};

const StructureSliders = (props) => {
  const { loanRequest, borrowers, handleChange, disabled, parentState } = props;
  const showInsurance =
    loanRequest.property.usageType === 'primary' &&
    getInsuranceFortune(borrowers) > 0;

  return (
    <div style={styles.div}>
      {getArray(borrowers, showInsurance).map(
        item =>
          item.max &&
          <h1 key={item.id} style={styles.h1}>
            <TextField
              id={item.id}
              floatingLabelText={item.labelText}
              onChange={e => handleChange(e.target.value, item.id)}
              disabled={disabled}
            >
              <MaskedInput
                value={inRange(0, item.max, parentState[item.id])}
                mask={swissFrancMask}
                guide
                pattern="[0-9]*"
              />
            </TextField>
            <Slider
              value={parentState[item.id]}
              min={0}
              max={item.max}
              onChange={(e, v) => handleChange(v, item.id)}
              style={styles.slider}
              sliderStyle={styles.slider}
              disabled={disabled}
            />
          </h1>,
      )}
    </div>
  );
};

StructureSliders.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  parentState: PropTypes.objectOf(PropTypes.any).isRequired,
};

StructureSliders.defaultProps = {
  disabled: false,
};

export default StructureSliders;
