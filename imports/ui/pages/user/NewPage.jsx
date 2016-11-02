import React, { PropTypes } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { insertRequest } from '/imports/api/creditrequests/methods.js';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


export default class NewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: '',
      errorText: '',
    };

    this.newRequest = this.newRequest.bind(this);
    this.textChange = this.textChange.bind(this);
  }

  newRequest() {
    // If there is an address, insert a new creditRequest
    if (this.state.textValue !== '') {
      insertRequest.call({}, (error, result) => {
        if (error) {
          // TODO: Remove this console log
          console.log(error);
          return;
        }

        FlowRouter.go('/main');
      });
    } else {
      this.setState({ errorText: 'Sans adresse, ça va être compliqué..' });
    }
  }

  textChange(e) {
    // Set textValue and remove errorText message if there was one
    this.setState({ textValue: e.target.value });
    if (this.state.errorText !== '') {
      if (e.target.value !== '') {
        this.setState({ errorText: '' });
      }
    }
  }

  render() {
    return (
      <section className="mask1 newPage">
        <h2>Bienvenue</h2>
        <p>
          Entrez la rue où se trouve votre future propriété,
           ce sera le titre de votre projet hypothécaire.
        </p>
        <TextField
          hintText="Rue du Pré 2"
          floatingLabelText="Adresse"
          value={this.state.textValue}
          onChange={this.textChange}
          errorText={this.state.errorText}
        />
        <br />
        <br />
        <RaisedButton label="Annuler" href="/main" />
        <RaisedButton label="Continuer" onClick={this.newRequest} primary />
      </section>
    );
  }
}

NewPage.propTypes = {
};
