import React from 'react';
import PropTypes from 'prop-types';

import Slider from '/imports/ui/components/general/Material/Slider';

import TextInput from '/imports/ui/components/general/TextInput';
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
    padding: '0 16px',
    maxWidth: 800,
    margin: '0 auto',
  },
  slider: {
    margin: 0,
  },
};

const StructureSliders = (props) => {
  const { loanRequest, borrowers, onChange, disabled, parentState } = props;
  const showInsurance =
    loanRequest.property.usageType === 'primary' &&
    getInsuranceFortune(borrowers) > 0;

  return (
    <div style={styles.div}>
      {getArray(borrowers, showInsurance).map(
        item =>
          item.max && (
            <h1 key={item.id} style={styles.h1} className="fixed-size">
              <TextInput
                id={item.id}
                label={item.labelText}
                onChange={(id, value) =>
                  onChange(inRange(0, item.max, value), id)}
                value={inRange(0, item.max, parentState[item.id])}
                disabled={disabled}
                type="money"
                style={{
                  height: '2.4em',
                  lineHeight: '36px',
                  maxWidth: '100%',
                }}
                labelStyle={{ fontSize: '0.8em' }}
              />
              <Slider
                value={parentState[item.id]}
                min={0}
                max={item.max}
                onChange={v => onChange(v, item.id)}
                style={styles.slider}
                // sliderStyle={styles.slider}
                disabled={disabled}
              />
            </h1>
          ),
      )}
    </div>
  );
};

StructureSliders.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  parentState: PropTypes.objectOf(PropTypes.any).isRequired,
};

StructureSliders.defaultProps = {
  disabled: false,
};

export default StructureSliders;
