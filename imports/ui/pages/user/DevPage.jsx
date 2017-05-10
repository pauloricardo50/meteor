import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanMethod from '/imports/api/cleanMethods';
import { Roles } from 'meteor/alanning:roles';

import { completeFakeBorrower } from '/imports/api/borrowers/fakes';
import { requestStep1, requestStep2, requestStep3 } from '/imports/api/loanrequests/fakes';

import { deleteRequest } from '/imports/api/loanrequests/methods';
import { deleteBorrower } from '/imports/api/borrowers/methods';
import { deleteOffer } from '/imports/api/offers/methods';

const addStep1Request = () => {
  cleanMethod('insertBorrower', completeFakeBorrower, null, (err, res) => {
    const request = requestStep1;
    request.borrowers = [res];
    cleanMethod('insertRequest', request, null);
  });
};

const addStep2Request = () => {
  cleanMethod('insertBorrower', completeFakeBorrower, null, (err, res) => {
    const request = requestStep2;
    request.borrowers = [res];
    cleanMethod('insertRequest', request, null);
  });
};

const addStep3Request = () => {};

const purge = props => {
  props.loanRequests.forEach(r => deleteRequest.call({ id: r._id }));
  props.borrowers.forEach(r => deleteBorrower.call({ id: r._id }));
  props.offers.forEach(r => deleteOffer.call({ id: r._id }));
};

export default class DevPage extends Component {
  componentDidMount() {
    if (!Roles.userIsInRole(this.props.currentUser, 'dev')) {
      this.props.history.push('/app');
    }
  }

  render() {
    return (
      <div>
        <button onClick={addStep1Request}>step 1 Request</button>
        <button onClick={addStep2Request}>step 2 Request</button>
        <button onClick={addStep3Request}>step 3 Request</button>
        <button onClick={() => purge(this.props)}>Purge</button>
      </div>
    );
  }
}

DevPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  offers: PropTypes.arrayOf(PropTypes.object),
};

DevPage.defaultProps = {
  loanRequests: [],
  borrowers: [],
  offers: [],
};
