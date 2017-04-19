import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

export default class VerificationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      verified: this.props.loanRequest.logic.adminValidated,
      showLoading: false,
    };
  }

  handleClick = () => {
    this.setState({ showLoading: true }, () =>
      Meteor.setTimeout(
        () => {
          const object = {};
          object['logic.adminValidated'] = true;
          cleanMethod(
            'updateRequest',
            object,
            this.props.loanRequest._id,
            error => !error && this.setState({ verified: true }),
          );
        },
        5000,
      ));
  };

  render() {
    let content = null;

    if (this.state.verified) {
      content = (
        <div
          className="text-center animated fadeIn"
          style={{ margin: '40px 0' }}
        >
          <h1 className="success">
            Votre dossier est valide! <span className="fa fa-check" />
          </h1>
          <div style={{ marginTop: 40 }}>
            <RaisedButton
              label="Continuer"
              primary
              containerElement={<Link to="/app" />}
            />
          </div>
        </div>
      );
    } else if (this.state.showLoading) {
      content = (
        <div style={{ height: 150 }} className="animated fadeIn">
          <LoadingComponent />
        </div>
      );
    } else {
      content = (
        <div className="text-center" style={{ margin: '40px 0' }}>
          <RaisedButton
            label="Envoyer mon dossier"
            primary
            onTouchTap={this.handleClick}
          />
        </div>
      );
    }

    return (
      <section className="mask1">
        <h1>Faites la vérification</h1>
        <div className="description">
          <p>
            Votre dossier va être analysé en détail par les professionels d'e-Potek, et vous conseiller pour préparer la meilleur demande possible.
          </p>
        </div>

        {content}
      </section>
    );
  }
}

VerificationPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
