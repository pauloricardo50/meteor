import React, { Component, PropTypes } from 'react';
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


export default class NewPage extends Component {
  constructor(props) {
    super(props);

    const queryParams = FlowRouter.current().queryParams;

    if (queryParams) {
      this.state = {
        startFormFilled: true,
        textValue: '',
        errorText: '',
      };
    } else {
      this.state = {
        startFormFilled: false,
        textValue: '',
        errorText: '',
      };
    }


    this.newRequest = this.newRequest.bind(this);
    this.textChange = this.textChange.bind(this);
  }

  componentDidMount() {
    if (this.state.startFormFilled) {
      DocHead.setTitle('Commencez Votre Demande - e-Potek');
    } else {
      FlowRouter.go('/start');
    }
  }

  newRequest(event) {
    event.preventDefault();

    if (this.state.startFormFilled) {
      // If the start form has been filled, insert all the data and head to /step1
      if (this.state.textValue) {
        this.createStartedRequest();
      } else {
        this.setState({ errorText: 'Sans adresse, ça va être compliqué..' });
      }
    }
  }

  createStartedRequest() {
    const q = FlowRouter.current().queryParams;

    if (q) {
      const object = {
        active: true,
        requestName: this.state.textValue,
        personalInfo: {
          twoBuyers: q.twoBuyers,
          age1: Number(q.age1),
          age2: (q.age2 ? Number(q.age2) : null),
          genderRequired: String(q.genderRequired),
          gender1: q.gender1,
          gender2: (q.gender2 ? q.gender2 : null),
        },
        financialInfo: {
          salary: Number(q.salary),
          bonusExists: String(q.bonusExists),
          bonus: Number(q.bonus),
          maxCash: String(q.maxCash),
          maxDebt: String(q.maxDebt),
          fortune: Number(q.fortune),
          insuranceFortune: Number(q.insuranceFortune),
        },
        propertyInfo: {
          type: q.propertyType,
          value: Number(q.propertyValue),
        },
      };


      insertRequest.call({ object }, (error, result) => {
        if (error) {
          // TODO: Remove this console log
          console.log(error);
          return;
        }
        FlowRouter.go('/main');
      });

    } else {
      this.setState({ errorText: 'Pas de query Params! Allez à www.e-potek.ch/start' });
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
        <h2>Bienvenue, continuons!</h2>
        <p>
          Entrez la rue où se trouve votre future propriété,
          ce sera le titre de votre projet hypothécaire.
        </p>
        <form onSubmit={this.newRequest}>
          <div className="text-center">
            <TextField
              hintText="Rue du Pré 2"
              floatingLabelText="Adresse du bien immobilier"
              value={this.state.textValue}
              onChange={this.textChange}
              errorText={this.state.errorText}
              autoFocus
            />
          </div>
          <br />
          <br />
          <RaisedButton label="Annuler" href="/main" style={styles.firstButton} />
          <RaisedButton label="Continuer" primary style={styles.secondButton} type="submit" />
        </form>
      </section>
    );
  }
}

NewPage.propTypes = {
};
