import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { insertRequest, insertStarterRequest } from '/imports/api/creditrequests/methods.js';

import NewUserOptions from '/imports/ui/components/general/NewUserOptions.jsx';


export default class MainPage extends React.Component {
  constructor() {
    super();

    this.newRequest = this.newRequest.bind(this);
    this.newStarterRequest = this.newStarterRequest.bind(this);
  }

  componentWillMount() {
    // if a creditRequest exists, route to the current step
    if (this.props.creditRequest) {
      const realStep = this.props.creditRequest.step + 1;
      FlowRouter.go(`/step${realStep}`);
    }
  }

  newRequest() {
    insertRequest.call({}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  }

  newStarterRequest() {
    const salary = Number(Session.get('salary'));
    const fortune = Number(Session.get('fortune'));
    const insuranceFortune = Number(Session.get('insuranceFortune'));
    const propertyValue = Number(Session.get('propertyValue'));
    const age = Number(Session.get('age'));
    const gender = Session.get('gender');

    // Insert request with values added in initial starter form
    insertStarterRequest.call({
      salary,
      fortune,
      insuranceFortune,
      propertyValue,
      age,
      gender
    }, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
    Session.set('startFormFilled', '');
  }

  render() {
    if (Session.get('startFormFilled') === 'true') {
      return (
        <div>
          <h4>Ça à l'air bien vide ici, continue ta demande hypothécaire!</h4>
          <button className="btn btn-success btn-large" onClick={this.newStarterRequest}>Continuer</button>
        </div>
      );
    } else if (!this.props.creditRequest) {
      return (
        <NewUserOptions />
      );
    }
    return null;
  }
}

MainPage.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any),
};
