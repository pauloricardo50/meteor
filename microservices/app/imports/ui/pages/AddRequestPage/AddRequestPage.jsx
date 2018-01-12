import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';
import { generalContainer } from 'core/containers/Containers';
import cleanMethod from 'core/api/cleanMethods';

import './AddRequestPage.scss';

class AddRequestPage extends Component {
  handleYes = () => {
    const { match: { params: { requestId } } } = this.props;

    cleanMethod('setUserToRequest', { requestId })
      .then(() => this.props.history.push(`/requests/${requestId}`))
      // Show an error, here data is lost if something went wrong
      .catch(() => this.props.history.push('/'));
  };

  handleNo = () =>
    Meteor.logout(() =>
      this.props.history.push(`/login?path=/add-request/${this.props.match.params.requestId}`));

  render() {
    const { currentUser: { emails } } = this.props;

    return (
      <div className="AddRequestPage">
        <h3>
          Voulez vous ajouter cette nouvelle demande de prêt au compte{' '}
          {emails[0].address}?
        </h3>
        <div className="buttons">
          <Button raised primary onClick={this.handleYes}>
            <T id="general.yes" />
          </Button>
          <Button raised onClick={this.handleNo}>
            <T id="AddRequestPage.logIntoOtherAccount" />
          </Button>
        </div>
      </div>
    );
  }
}

AddRequestPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default generalContainer(AddRequestPage);
