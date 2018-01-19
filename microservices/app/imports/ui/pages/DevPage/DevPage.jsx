import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanMethod from 'core/api/cleanMethods';
import { Roles } from 'meteor/alanning:roles';

import { completeFakeBorrower } from 'core/api/borrowers/fakes';
import {
  requestStep1,
  requestStep2,
  requestStep3,
} from 'core/api/loanrequests/fakes';
import { getRandomOffer } from 'core/api/offers/fakes';
import { fakeProperty } from 'core/api/properties/fakes';

const addStep1Request = (twoBorrowers) => {
  const borrowerIds = [];
  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? cleanMethod('insertBorrower', { object: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return cleanMethod('insertProperty', { object: fakeProperty });
    })
    .then((propertyId) => {
      const request = requestStep1;
      request.borrowers = borrowerIds;
      request.property = propertyId;
      cleanMethod('insertRequest', { object: request });
    })
    .catch(console.log);
};

const addStep2Request = (twoBorrowers) => {
  const borrowerIds = [];

  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? cleanMethod('insertBorrower', { object: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return cleanMethod('insertProperty', { object: fakeProperty });
    })
    .then((propertyId) => {
      const request = requestStep2;
      request.borrowers = borrowerIds;
      request.property = propertyId;
      cleanMethod('insertRequest', { object: request });
    })
    .catch(console.log);
};

const addStep3Request = (twoBorrowers, completeFiles = true) => {
  const borrowerIds = [];
  const request = requestStep3(completeFiles);
  let requestId;
  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? cleanMethod('insertBorrower', { object: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return cleanMethod('insertProperty', { object: fakeProperty });
    })
    .then((propertyId) => {
      request.borrowers = borrowerIds;
      request.property = propertyId;
    })
    .then(() => cleanMethod('insertRequest', { object: request }))
    .then((id) => {
      requestId = id;
      const object = getRandomOffer(
        { loanRequest: { ...request, _id: id }, property: fakeProperty },
        true,
      );
      return cleanMethod('insertAdminOffer', { object });
    })
    .then(offerId =>
      cleanMethod('updateRequest', {
        object: {
          'logic.lender.offerId': offerId,
          'logic.lender.chosenTime': new Date(),
        },
        id: requestId,
      }))
    .then(() => {
      // Weird bug with offers publications that forces me to reload TODO: fix it
      location.reload();
    })
    .catch(console.log);
};

const purge = ({
  loanRequests, borrowers, offers, properties,
}) => {
  loanRequests.forEach(r => cleanMethod('deleteRequest', { id: r._id }));
  borrowers.forEach(r => cleanMethod('deleteBorrower', { id: r._id }));
  offers.forEach(r => cleanMethod('deleteOffer', { id: r._id }));
  properties.forEach(r => cleanMethod('deleteProperty', { id: r._id }));
};

export default class DevPage extends Component {
  constructor(props) {
    super(props);

    this.state = { twoBorrowers: false };
  }

  componentDidMount() {
    if (!Roles.userIsInRole(this.props.currentUser, 'dev')) {
      this.props.history.push('/');
    }
  }

  handleChange = () =>
    this.setState(prev => ({ twoBorrowers: !prev.twoBorrowers }));

  render() {
    const { twoBorrowers } = this.state;
    return (
      <div>
        <input
          type="checkbox"
          name="vehicle"
          value={twoBorrowers}
          onChange={this.handleChange}
        />
        2 emprunteurs<br />
        <button onClick={() => addStep1Request(twoBorrowers)}>
          step 1 Request
        </button>
        <button onClick={() => addStep2Request(twoBorrowers)}>
          step 2 Request
        </button>
        <button onClick={() => addStep3Request(twoBorrowers)}>
          step 3 Request
        </button>
        <button onClick={() => addStep3Request(twoBorrowers, false)}>
          step 3 Request, few files
        </button>
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
