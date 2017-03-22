import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import {
  toMoney,
  toNumber,
  toDecimalNumber,
} from '/imports/js/helpers/conversionFunctions';
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
};

const getFormArray = i => [
  {
    label: 'Libor',
    name: `libor_${i}`,
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

export default class PartnerOfferForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maxAmount: '',
      amortizing: '',
      libor_0: '',
      interest5_0: '',
      interest10_0: '',
      interest15_0: '',
      conditions: '',
      libor_1: '',
      interest5_1: '',
      interest10_1: '',
      interest15_1: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, newValue, name) {
    this.setState({ [name]: newValue });
  }

  handleSubmit(event) {
    event.preventDefault();

    // Prevent enter key from submitting form
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }

    const id = this.props.match.params.requestId;
    const object = {
      requestId: id,
      standardOffer: {
        maxAmount: toNumber(this.state.maxAmount),
        amortizing: toDecimalNumber(this.state.amortizing),
        interestLibor: toDecimalNumber(this.state.libor_0),
        interest5: toDecimalNumber(this.state.interest5_0),
        interest10: toDecimalNumber(this.state.interest10_0),
        interest15: toDecimalNumber(this.state.interest15_0),
      },
      conditionsOffer: {
        maxAmount: toNumber(this.state.maxAmount),
        amortizing: toDecimalNumber(this.state.amortizing),
        interestLibor: toDecimalNumber(this.state.libor_1),
        interest5: toDecimalNumber(this.state.interest5_1),
        interest10: toDecimalNumber(this.state.interest10_1),
        interest15: toDecimalNumber(this.state.interest15_1),
      },
      conditions: this.state.conditions,
      expertiseRequired: false, // TODO
    };

    cleanMethod('insertOffer', id, object, error => {
      if (!error) {
        this.props.history.push('/partner');
      }
    });
  }

  render() {
    return (
      <article className="col-xs-12" style={styles.article}>
        <h1 className="col-xs-12">Faire une Offre</h1>
        <form onSubmit={this.handleSubmit}>

          <div className="col-xs-12">
            <TextField
              floatingLabelText="Prêt Maximal"
              hintText={
                `CHF ${toMoney(Math.round(this.props.loanRequest.property.value * 0.8))}`
              }
              type="number"
              onChange={(e, n) => this.handleChange(e, n, 'maxAmount')}
              value={this.state.maxAmount}
            >
              <MaskedInput mask={swissFrancMask} guide pattern="\d+(\.\d*)?" />
            </TextField>
          </div>

          <div className="col-xs-12">
            <TextField
              floatingLabelText="Amortissement"
              hintText={'1%'}
              type="text"
              onChange={(e, n) => this.handleChange(e, n, 'amortizing')}
              value={this.state.amortizing}
            >
              <MaskedInput mask={percentMask} guide pattern="\d+(\.\d*)?" />
            </TextField>
          </div>

          <h4 className="text-center col-xs-12" style={styles.h4}>
            Taux Standard
          </h4>

          {getFormArray(0).map((field, index) => (
            <div className="col-xs-6 col-md-3" key={index}>
              <TextField
                floatingLabelText={field.label}
                hintText={'1%'}
                type="text"
                fullWidth
                onChange={(e, n) => this.handleChange(e, n, field.name)}
                value={this.state[field.name]}
              >
                <MaskedInput mask={percentMask} guide pattern="\d+(\.\d*)?" />
              </TextField>
            </div>
          ))}

          <h4 className="text-center col-xs-12" style={styles.h4}>
            Taux d'intérêt préférentiels
          </h4>

          <div className="col-xs-10 col-xs-offset-1">
            <TextField
              floatingLabelText="Condition(s) spéciale(s)"
              hintText="Gestion de Fortune, Assurance Voiture"
              type="text"
              multiLine
              fullWidth
              rows={3}
              onChange={(e, n) => this.handleChange(e, n, 'conditions')}
              value={this.state.conditions}
            />
          </div>

          {getFormArray(1).map((field, index) => (
            <div className="col-xs-6 col-md-3" key={index}>
              <TextField
                floatingLabelText={field.label}
                hintText={'1%'}
                type="text"
                fullWidth
                onChange={(e, n) => this.handleChange(e, n, field.name)}
                value={this.state[field.name]}
              >
                <MaskedInput mask={percentMask} guide pattern="\d+(\.\d*)?" />
              </TextField>
            </div>
          ))}

          <div className="col-xs-12" style={styles.buttons}>
            <RaisedButton
              label="Annuler"
              containerElement={<Link to="/partner" />}
              style={styles.button}
            />
            <RaisedButton label="Envoyer" type="submit" primary />
          </div>
        </form>
      </article>
    );
  }
}

PartnerOfferForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
