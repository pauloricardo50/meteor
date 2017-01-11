import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


import { getAllPartners } from '/imports/js/partnerList';
import getCantons from '/imports/js/cantons';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask.js';
import { createPartner } from '/imports/api/users/methods';


const styles = {
  h1: {
    marginBottom: 40,
  },
  buttonDiv: {
    marginTop: 15,
  },
  button: {
    marginLeft: 16,
  },
};

export default class NewPartnerForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      partner: null,
      canton: null,
      errorText: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSelectChange1 = this.handleSelectChange1.bind(this);
    this.handleSelectChange2 = this.handleSelectChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.email || !this.state.partner || !this.state.canton) {
      this.setState({ errorText: 'Tous les champs sont requis' });
      return;
    }
    this.setState({ errorText: '' });

    const options = {
      email: this.state.email,
      profile: {
        organization: this.state.partner,
        cantons: [this.state.canton],
      },
      password: 'asdfghj',
    };


    createPartner.call({ options },
      (error, result) => {
        console.log('result: ' + result);
        if (error) {
          throw new Meteor.Error(400, error.message);
        }
        // Route to admin on success
        FlowRouter.go('/admin');
      });
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSelectChange1(event, index, value) {
    this.setState({ partner: value });
  }

  handleSelectChange2(event, index, value) {
    this.setState({ canton: value });
  }

  render() {
    return (
      <article>
        <h1 style={styles.h1}>Ajouter un compte partenaire</h1>
        <form action="submit" onSubmit={this.handleSubmit}>
          <TextField
            floatingLabelText="E-mail"
            hintText="mail@preteur.ch"
            value={this.state.email}
            onChange={this.handleEmailChange}
            errorText={!this.state.email && this.state.errorText}
            fullWidth
            required
          >
            <MaskedInput
              mask={emailMask}
              guide
              autoFocus
            />
          </TextField>

          <SelectField
            floatingLabelText="Banque"
            hintText="Choisis une Banque"
            value={this.state.partner}
            onChange={this.handleSelectChange1}
            errorText={!this.state.partner && this.state.errorText}
            fullWidth
            maxHeight={200}
            required
          >
            <MenuItem value={null} primaryText="" />
            {getAllPartners().map((partner, index) =>
              (<MenuItem
                value={partner.key}
                primaryText={partner.name}
                key={index}
              />),
            )}
          </SelectField>

          <SelectField
            floatingLabelText="Canton"
            hintText="Choisis un Canton"
            value={this.state.canton}
            onChange={this.handleSelectChange2}
            errorText={!this.state.canton && this.state.errorText}
            fullWidth
            maxHeight={200}
            required
          >
            <MenuItem value={null} primaryText="" />
            {getCantons().map((canton, index) =>
              (<MenuItem
                value={canton.key}
                primaryText={canton.name}
                key={index}
              />),
            )}
          </SelectField>

          <div className="pull-right" style={styles.buttonDiv}>
            <RaisedButton
              label="Annuler"
              href="/admin"
              style={styles.button}
            />
            <RaisedButton
              label="Créer"
              primary
              type="submit"
              style={styles.button}
            />
          </div>

        </form>
      </article>
    );
  }
}

NewPartnerForm.propTypes = {
};
