import React from 'react';
import { Meteor } from 'meteor/meteor';
import { insertRequest } from '/imports/api/creditrequests/methods.js';

import RequestPanel from '/imports/ui/components/general/RequestPanel.jsx';

export default class MainPage extends React.Component {
  constructor() {
    super();

    this.newRequest = this.newRequest.bind(this);
  }

  newRequest() {
    insertRequest.call({}, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  }

  render() {
    if (!this.props.creditRequests) {
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
        {this.props.creditRequests.map((creditRequest) => {
          return <RequestPanel key={creditRequest._id} creditRequest={creditRequest} />;
        })}
      </div>
    );
  }
}
