import PropTypes from 'prop-types';
import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';
import Button from '/imports/ui/components/general/Button';
import Checkbox from 'material-ui/Checkbox';

import { toMoney, toNumber } from '/imports/js/helpers/conversionFunctions';
import { swissFrancMask, percentMask } from '/imports/js/helpers/textMasks';
import cleanMethod from '/imports/api/cleanMethods';

const styles = {
  article: {
    marginTop: 40,
  },
  buttons: {
    marginTop: 40,
    textAlign: 'right',
  },
  button: {
    marginRight: 16,
  },
  h4: {
    marginTop: 40,
    display: 'inline-block',
  },
  checkbox: {
    margin: '20px 0',
  },
};

const getFormArray = i => [
  {
    label: 'Libor',
    name: `libor_${i}`,
  },
  {
    label: 'Fixe 1 an',
    name: `interest1_${i}`,
  },
  {
    label: 'Fixe 2 ans',
    name: `interest2_${i}`,
  },
  {
    label: 'Fixe 5 ans',
    name: `interest5_${i}`,
  },
  {
    label: 'Fixe 10 ans',
    name: `interest10_${i}`,
  },
  {
    label: 'Fixe 15 ans',
    name: `interest15_${i}`,
  },
];

export default class OfferForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCounterpart: false,
      organization: '',
      maxAmount: '',
      amortization: '',
      libor_0: '',
      interest5_0: '',
      interest10_0: '',
      interest15_0: '',
      conditions: '',
      counterparts: '',
      libor_1: '',
      interest5_1: '',
      interest10_1: '',
      interest15_1: '',
    };
  }

  handleChange = (event, newValue, name) => {
    const object = {};
    object[name] = newValue;
    this.setState(object);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    // Prevent enter key from submitting form
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }

    const object = {
      requestId: this.props.loanRequest._id,
      organization: this.state.organization,
      standardOffer: {
        maxAmount: toNumber(this.state.maxAmount),
        amortization: parseFloat(this.state.amortization) / 100,
        interestLibor: parseFloat(this.state.libor_0) / 100,
        interest1: parseFloat(this.state.interest1_0) / 100,
        interest2: parseFloat(this.state.interest2_0) / 100,
        interest5: parseFloat(this.state.interest5_0) / 100,
        interest10: parseFloat(this.state.interest10_0) / 100,
        interest15: parseFloat(this.state.interest15_0) / 100,
      },

      conditions: [this.state.conditions],
    };

    if (this.state.showCounterpart) {
      object.counterpartOffer = {
        maxAmount: toNumber(this.state.maxAmount),
        amortization: parseFloat(this.state.amortization) / 100,
        interestLibor: parseFloat(this.state.libor_1) / 100,
        interest1: parseFloat(this.state.interest1_1) / 100,
        interest2: parseFloat(this.state.interest2_1) / 100,
        interest5: parseFloat(this.state.interest5_1) / 100,
        interest10: parseFloat(this.state.interest10_1) / 100,
        interest15: parseFloat(this.state.interest15_1) / 100,
      };

      object.counterparts = [this.state.counterparts];
    }

    cleanMethod(this.props.method, object).catch((error) => {
      if (!error) {
        this.props.callback();
      }
    });
  };

  render() {
    return (
      <article className="col-xs-12" style={styles.article}>
        <form onSubmit={this.handleSubmit}>
          {this.props.admin &&
            <TextField
              floatingLabelText="Institution"
              hintText="UBS"
              onChange={(e, n) => this.handleChange(e, n, 'organization')}
              value={this.state.organization}
            />}

          <TextField
            floatingLabelText="Condition(s) minimum"
            hintText="Expertise requise"
            type="text"
            multiLine
            fullWidth
            rows={3}
            onChange={(e, n) => this.handleChange(e, n, 'conditions')}
            value={this.state.conditions}
          />

          <div className="col-xs-12">
            <TextField
              floatingLabelText="Prêt Maximal"
              pattern="[0-9]*"
              hintText={`CHF ${toMoney(
                Math.round(this.props.loanRequest.property.value * 0.8),
              )}`}
              onChange={(e, n) => this.handleChange(e, n, 'maxAmount')}
            >
              <MaskedInput
                mask={swissFrancMask}
                guide
                value={this.state.maxAmount}
              />
            </TextField>
          </div>

          <div className="col-xs-12">
            <TextField
              floatingLabelText="Amortissement"
              hintText={'1%'}
              type="text"
              onChange={(e, n) => this.handleChange(e, n, 'amortization')}
            >
              <MaskedInput
                mask={percentMask}
                guide
                value={this.state.amortization}
              />
            </TextField>
          </div>

          <h4 className="text-center col-xs-12" style={styles.h4}>
            Taux Standard
          </h4>

          {getFormArray(0).map(field =>
            (<div className="col-xs-6 col-md-3" key={field.name}>
              <TextField
                floatingLabelText={field.label}
                hintText={'1%'}
                type="text"
                fullWidth
                onChange={(e, n) => this.handleChange(e, n, field.name)}
              >
                <MaskedInput
                  mask={percentMask}
                  guide
                  value={this.state[field.name]}
                />
              </TextField>
            </div>),
          )}

          <Checkbox
            label="Ajouter une offre avec contrepartie"
            style={styles.checkbox}
            className="col-xs-12"
            onCheck={() =>
              this.setState(prev => ({
                showCounterpart: !prev.showCounterpart,
              }))}
            checked={this.state.showCounterpart}
          />

          {this.state.showCounterpart &&
            <div>
              <h4 className="text-center col-xs-12" style={styles.h4}>
                Taux d'intérêt avec contrepartie
              </h4>

              <div className="col-xs-10 col-xs-offset-1">
                <TextField
                  floatingLabelText="Contrepartie(s) spéciale(s)"
                  hintText="Gestion de Fortune, Assurance Voiture"
                  type="text"
                  multiLine
                  fullWidth
                  rows={3}
                  onChange={(e, n) => this.handleChange(e, n, 'counterparts')}
                  value={this.state.counterparts}
                />
              </div>

              {getFormArray(1).map(field =>
                (<div className="col-xs-6 col-md-3" key={field.name}>
                  <TextField
                    floatingLabelText={field.label}
                    hintText={'1%'}
                    type="text"
                    fullWidth
                    onChange={(e, n) =>
                      this.handleChange(e, parseFloat(n), field.name)}
                  >
                    <MaskedInput
                      mask={percentMask}
                      guide
                      value={this.state[field.name]}
                    />
                  </TextField>
                </div>),
              )}
            </div>}

          <div className="col-xs-12" style={styles.buttons}>
            {this.props.handleCancel &&
              <Button
                raised
                label="Annuler"
                style={styles.button}
                onClick={this.props.handleCancel}
              />}
            <Button raised label="Envoyer" type="submit" primary />
          </div>
        </form>
      </article>
    );
  }
}

OfferForm.propTypes = {
  callback: PropTypes.func.isRequired,
  handleCancel: PropTypes.func,
  method: PropTypes.string.isRequired,
  admin: PropTypes.bool,
};

OfferForm.defaultProps = {
  handleCancel: undefined,
  admin: false,
};
