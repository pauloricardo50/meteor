import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';
import RaisedButton from 'material-ui/RaisedButton';


import { toMoney, toNumber } from '/imports/js/finance-math.js';
import { swissFrancMask, percentMask } from '/imports/js/textMasks.js';


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


const standardArray = [
  {
    label: 'Libor',
  },
  {
    label: 'Fixe 5 ans',
  },
  {
    label: 'Fixe 10 ans',
  },
  {
    label: 'Fixe 15 ans',
  },
];


export default class PartnerOfferForm extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Prevent enter key from submitting form
    if(event.keyCode === 13) {
      event.preventDefault();
      return false;
    }

    console.log('submitting');
    // TODO
  }

  render() {
    return (
      <article className="col-xs-12" style={styles.article}>
        <h1>Faire une Offre</h1>
        <form onSubmit={this.handleSubmit}>


          <TextField
            floatingLabelText="Prêt Maximal"
            hintText={`CHF ${toMoney(Math.round(this.props.loanRequest.property.value * 0.8))}`}
            type="text"
          >
            <MaskedInput
              mask={swissFrancMask}
              guide
              pattern="[0-9]*"
            />
          </TextField>


          <h4 className="text-center col-xs-12" style={styles.h4}>Taux Standard</h4>

          {standardArray.map((field, index) => (
            <div className="col-xs-6 col-md-3" key={index}>
              <TextField
                floatingLabelText={field.label}
                hintText={'1%'}
                type="text"
                fullWidth
              >
                <MaskedInput
                  mask={percentMask}
                  guide
                  pattern="[0-9]*"
                />
              </TextField>
            </div>
          ))}

          <h4 className="text-center col-xs-12" style={styles.h4}>Taux d'intérêt préférentiels</h4>

          <div className="col-xs-10 col-xs-offset-1">
            <TextField
              floatingLabelText="Condition(s) spéciale(s)"
              hintText="Gestion de Fortune, Assurance Voiture"
              type="text"
              multiLine
              fullWidth
              rows={3}
            />
          </div>

          {standardArray.map((field, index) => (
            <div className="col-xs-6 col-md-3" key={index}>
              <TextField
                floatingLabelText={field.label}
                hintText={'1%'}
                type="text"
                fullWidth
              >
                <MaskedInput
                  mask={percentMask}
                  guide
                  pattern="[0-9]*"
                />
              </TextField>
            </div>
          ))}


          <div className="col-xs-12" style={styles.buttons}>
            <RaisedButton
              label="Annuler"
              href="/partner"
              style={styles.button}
            />
            <RaisedButton
              label="Envoyer"
              type="submit"
              primary
            />
          </div>
        </form>
      </article>
    );
  }
}

PartnerOfferForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
