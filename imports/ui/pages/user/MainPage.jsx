import React from 'react';
import { insertRequest, insertStarterRequest } from '/imports/api/creditrequests/methods.js';

import RequestPanel from '/imports/ui/components/general/RequestPanel.jsx';

export default class MainPage extends React.Component {
  constructor() {
    super();

    this.newRequest = this.newRequest.bind(this);
    this.newStarterRequest = this.newStarterRequest.bind(this);
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
    insertStarterRequest.call({ salary, fortune, insuranceFortune, propertyValue, age, gender }, (error, result) => {
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
          <h4>Ca à l'air bien vide ici, continue ta demande hypothécaire!</h4>
          <button className="btn btn-success btn-large" onClick={this.newStarterRequest}>Continuer</button>
        </div>
      );
    } else if (this.props.creditRequests.length === 0) {
      return (
        <div>
          <h4>T'as l'air bien seul ici, fais une nouvelle requete!</h4>
          <button className="btn btn-default" onClick={this.newRequest}>Nouveau</button>
        </div>
      );
    }
    return (
      <div>
        <h2>Mes Financements</h2>
        {this.props.creditRequests.map(creditRequest =>
          <RequestPanel key={creditRequest._id} creditRequest={creditRequest} />
        )}
      </div>
    );
  }
}

MainPage.propTypes = {
  creditRequests: React.PropTypes.arrayOf(React.PropTypes.object),
};
