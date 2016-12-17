import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';
import RaisedButton from 'material-ui/RaisedButton';


import { toMoney, toNumber } from '/imports/js/finance-math.js';
import { swissFrancMask } from '/imports/js/textMasks.js';


const styles = {
  article: {
    marginTop: 40,
  },
  button: {
    marginRight: 16,
  },
};

export default class PartnerOfferForm extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();

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
            hintText={`CHF ${toMoney(Math.round(this.props.creditRequest.propertyInfo.value * 0.8))}`}
            type="text"
          >
            <MaskedInput
              mask={swissFrancMask}
              guide
              pattern="[0-9]*"
            />
          </TextField>

          <div className="col-xs-12">
            <RaisedButton
              label="Annuler"
              href="/partner"
              style={styles.button}
            />
            <RaisedButton
              label="Valider"
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
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
