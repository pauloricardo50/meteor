import React, { PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { insertRequest } from '/imports/api/creditrequests/methods.js';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  firstButton: {
    float: 'left',
  },
  secondButton: {
    float: 'right',
  },
};


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

  componentDidMount() {
    DocHead.setTitle('Nouvelle Demande - e-Potek');
  }

  newRequest() {
    // If there is an address, insert a new creditRequest
    if (this.state.textValue !== '') {
      insertRequest.call({ requestName: this.state.textValue }, (error, result) => {
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
      <section className="mask1 animated fadeIn newPage col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h2>Bienvenue</h2>
        <p>
          Entrez la rue où se trouve votre future propriété,
           ce sera le titre de votre projet hypothécaire.
        </p>
        <div className="text-center">
          <TextField
            hintText="Rue du Pré 2"
            floatingLabelText="Adresse"
            value={this.state.textValue}
            onChange={this.textChange}
            errorText={this.state.errorText}
          />
        </div>
        <br />
        <br />
        <RaisedButton label="Annuler" href="/main" style={styles.firstButton} />
        <RaisedButton label="Continuer" onClick={this.newRequest} primary style={styles.secondButton} />
      </section>
    );
  }
}

NewPage.propTypes = {
};
