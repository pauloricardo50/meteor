import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Button from 'core/components/Button';
import Checkbox from 'core/components/Checkbox';
import TextInput from 'core/components/TextInput';
import { toMoney, toNumber } from 'core/utils/conversionFunctions';
import { insertAdminOffer } from 'core/api';

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

const fix = val => parseFloat(val) / 100 || undefined;

export default class OfferForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCounterpart: false,
      organization: '',
      maxAmount: '',
      amortization: '',
      libor_0: '',
      interest1_0: '',
      interest2_0: '',
      interest5_0: '',
      interest10_0: '',
      interest15_0: '',
      conditions: '',
      counterparts: '',
      libor_1: '',
      interest1_1: '',
      interest2_1: '',
      interest5_1: '',
      interest10_1: '',
      interest15_1: '',
      error: '',
    };
  }

  handleChange = (name, newValue) => {
    const object = {};
    object[name] = newValue;
    this.setState(object);
  };

  handleSubmit = (event) => {
    console.log('submitting..');
    event.preventDefault();

    if (!this.validate()) {
      return;
    }

    // Prevent enter key from submitting form
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }

    const object = {
      loanId: this.props.loan._id,
      organization: this.state.organization,
      standardOffer: {
        maxAmount: toNumber(this.state.maxAmount),
        amortization: parseFloat(this.state.amortization),
        interestLibor: parseFloat(this.state.libor_0) || undefined,
        interest1: parseFloat(this.state.interest1_0) || undefined,
        interest2: parseFloat(this.state.interest2_0) || undefined,
        interest5: parseFloat(this.state.interest5_0) || undefined,
        interest10: parseFloat(this.state.interest10_0) || undefined,
        interest15: parseFloat(this.state.interest15_0) || undefined,
      },

      conditions: [this.state.conditions],
    };

    if (this.state.showCounterpart) {
      object.counterpartOffer = {
        maxAmount: toNumber(this.state.maxAmount),
        amortization: parseFloat(this.state.amortization),
        interestLibor: parseFloat(this.state.libor_1) || undefined,
        interest1: parseFloat(this.state.interest1_1) || undefined,
        interest2: parseFloat(this.state.interest2_1) || undefined,
        interest5: parseFloat(this.state.interest5_1) || undefined,
        interest10: parseFloat(this.state.interest10_1) || undefined,
        interest15: parseFloat(this.state.interest15_1) || undefined,
      };

      object.counterparts = [this.state.counterparts];
    }

    console.log(object);

    insertAdminOffer
      .run({ object })
      .then(this.props.callback)
      .catch((error) => {
        console.log('OfferForm error:', error);

        if (!error) {
          this.props.callback();
        }
      });
  };

  validate = () => {
    const { showCounterpart, counterparts } = this.state;
    if (showCounterpart && !counterparts) {
      this.setState({ error: 'Il faut des contreparties' });
      return false;
    }

    this.setState({ error: '' });
    return true;
  };

  render() {
    const { admin, loan, handleCancel, property } = this.props;
    const {
      organization,
      conditions,
      maxAmount,
      amortization,
      showCounterpart,
      counterparts,
      error,
    } = this.state;

    return (
      <article className="flex-col" style={styles.article}>
        <form onSubmit={this.handleSubmit} noValidate>
          {admin && (
            <TextInput
              id="organization"
              label="Institution *"
              placeholder="UBS"
              onChange={this.handleChange}
              value={organization}
              noIntl
            />
          )}

          <TextInput
            id="conditions"
            label="Condition(s) minimum"
            placeholder="Laisser vide si pas de conditions"
            type="text"
            multiline
            rows={3}
            onChange={this.handleChange}
            value={conditions}
            noIntl
          />

          <div>
            <TextInput
              id="maxAmount"
              label="Prêt Maximal *"
              placeholder={`CHF ${toMoney(Math.round(property.value * 0.8))}`}
              onChange={this.handleChange}
              type="money"
              value={maxAmount}
              noIntl
            />
          </div>

          <div>
            <TextInput
              id="amortization"
              label="Amortissement *"
              placeholder="1%"
              onChange={this.handleChange}
              type="percent"
              value={amortization}
              noIntl
            />
          </div>

          <h4 className="text-center" style={styles.h4}>
            Taux Standard
          </h4>

          <div className="flex" style={{ flexWrap: 'wrap' }}>
            {getFormArray(0).map(({ name, label }) => (
              <div key={name} style={{ marginRight: 8 }}>
                <TextInput
                  id={name}
                  label={label}
                  // placeholder="1%"
                  type="percent"
                  onChange={this.handleChange}
                  value={this.state[name]}
                  noIntl
                />
              </div>
            ))}
          </div>

          <Checkbox
            label="Ajouter une offre avec contrepartie"
            style={styles.checkbox}
            onChange={(_, newValue) =>
              this.setState({ showCounterpart: newValue })
            }
            value={showCounterpart}
            id="showCounterpart"
          />

          {showCounterpart && (
            <div>
              <h4 className="text-center" style={styles.h4}>
                Taux d'intérêt avec contrepartie
              </h4>

              <div>
                <TextInput
                  id="counterparts"
                  label="Contrepartie(s) spéciale(s) *"
                  placeholder="Gestion de Fortune, Assurance Voiture"
                  type="text"
                  multiline
                  fullWidth
                  rows={3}
                  onChange={this.handleChange}
                  value={counterparts}
                  noIntl
                />
              </div>

              <div className="flex" style={{ flexWrap: 'wrap' }}>
                {getFormArray(1).map(({ name, label }) => (
                  <div key={name} style={{ marginRight: 8 }}>
                    <TextInput
                      id={name}
                      label={label}
                      placeholder="1%"
                      type="percent"
                      fullWidth
                      onChange={this.handleChange}
                      value={this.state[name]}
                      noIntl
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="description">
              <p className="error">{error}</p>
            </div>
          )}

          <div style={styles.buttons}>
            {!!handleCancel && (
              <Button
                raised
                label="Annuler"
                style={styles.button}
                onClick={handleCancel}
              />
            )}
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
  admin: PropTypes.bool,
};

OfferForm.defaultProps = {
  handleCancel: undefined,
  admin: false,
};
