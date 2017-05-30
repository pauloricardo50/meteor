import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Slider from 'material-ui/Slider';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/helpers/textMasks';

import LoadingButton from '/imports/ui/components/general/LoadingButton.jsx';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';

import { getFortune, getInsuranceFortune } from '/imports/js/helpers/finance-math';
import { toNumber } from '/imports/js/helpers/conversionFunctions';

const handleClick = (props, state) => {
  // Save data to DB
  const object = {};
  object['logic.hasValidatedStructure'] = true;
  object['general.fortuneUsed'] = state.fortuneUsed;
  object['general.insuranceFortuneUsed'] = state.insuranceFortuneUsed;

  cleanMethod('updateRequest', object, props.loanRequest._id);
};

const getArray = (borrowers, showInsurance) => [
  {
    labelText: 'Épargne',
    id: 'fortuneUsed',
    sliderIncrement: 0,
    max: getFortune(borrowers),
  },
  ...(showInsurance
    ? {
      labelText: 'Prévoyance',
      id: 'insuranceFortuneUsed',
      sliderIncrement: 0,
      max: getInsuranceFortune(borrowers),
    }
    : {}),
];

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

const inRange = (min, max, val) => Math.max(min, Math.min(max, val));

export default class StructurePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fortuneUsed: this.props.loanRequest.general.fortuneUsed,
      insuranceFortuneUsed: this.props.loanRequest.general.insuranceFortuneUsed,
    };
  }

  handleChange = (value, id) => {
    const object = {};
    object[id] = Math.round(toNumber(value));
    this.setState(object);
  };

  render() {
    const showInsurance =
      this.props.loanRequest.property.usageType === 'primary' &&
      getInsuranceFortune(this.props.borrowers) > 0;
    return (
      <ProcessPage {...this.props} stepNb={2} id="structure" showBottom={false}>
        <section className="mask1">
          <h1>Structure du Projet</h1>
          <div className="description">
            <p>
              Vous pouvez ajuster la structure globale de votre projet une dernière fois, nous vous aiderons à la peaufiner.
            </p>
          </div>

          {getArray(this.props.borrowers, showInsurance).map(item => (
            <h1 key={item.id} style={styles.div}>
              <TextField
                id={item.id}
                floatingLabelText={item.labelText}
                onChange={e => this.handleChange(e.target.value, item.id)}
              >
                <MaskedInput
                  value={inRange(0, item.max, this.state[item.id])}
                  mask={swissFrancMask}
                  guide
                  pattern="[0-9]*"
                />
              </TextField>
              <Slider
                value={this.state[item.id]}
                min={0}
                max={item.max}
                onChange={(e, v) => this.handleChange(v, item.id)}
                style={styles.slider}
              />
            </h1>
          ))}

          <div className="text-center" style={{ margin: '40px 0' }}>
            <LoadingButton
              label="Valider la structure"
              handleClick={() => handleClick(this.props, this.state)}
              value={this.props.loanRequest.logic.hasValidatedStructure}
            />
          </div>
        </section>
      </ProcessPage>
    );
  }
}

StructurePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
