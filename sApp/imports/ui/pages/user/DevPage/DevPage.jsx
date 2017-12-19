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

import { updateRequest, deleteRequest } from 'core/api/loanrequests/methods';
import { deleteBorrower } from 'core/api/borrowers/methods';
import { deleteOffer, insertAdminOffer } from 'core/api/offers/methods';

const addStep1Request = (twoBorrowers) => {
  const ids = [];
  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      ids.push(id1);
      if (twoBorrowers) {
        return cleanMethod('insertBorrower', { object: completeFakeBorrower });
      }
    })
    .then((id2) => {
      if (id2) {
        ids.push(id2);
      }
      const request = requestStep1;
      request.borrowers = ids;
      cleanMethod('insertRequest', { object: request });
    });
};

const addStep2Request = (twoBorrowers) => {
  const ids = [];

  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      ids.push(id1);
      if (twoBorrowers) {
        return cleanMethod('insertBorrower', { object: completeFakeBorrower });
      }
    })
    .then((id2) => {
      if (id2) {
        ids.push(id2);
      }
      const request = requestStep2;
      request.borrowers = ids;
      cleanMethod('insertRequest', { object: request });
    });
};

const addStep3Request = (twoBorrowers, completeFiles = true) => {
  const ids = [];
  const request = requestStep3(completeFiles);
  let requestId;
  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      ids.push(id1);
      if (twoBorrowers) {
        return cleanMethod('insertBorrower', { object: completeFakeBorrower });
      }
    })
    .then((id2) => {
      if (id2) {
        ids.push(id2);
      }
      request.borrowers = ids;
    })
    .then(() => cleanMethod('insertRequest', { object: request }))
    .then((id) => {
      requestId = id;
      const object = getRandomOffer({ ...request, _id: requestId }, true);
      return insertAdminOffer.callPromise({ object });
    })
    .then(offerId =>
      updateRequest.callPromise({
        object: {
          'logic.lender.offerId': offerId,
          'logic.lender.chosenTime': new Date(),
        },
        id: requestId,
      }))
    .then(() => {
      // Weird bug with offer publications that forces me to reload TODO: fix it
      location.reload();
    })
    .catch(console.log);

  //   cleanMethod('insertRequest', request, null, (error, result) => {
  //     const object = getRandomOffer({ ...request, _id: result }, true);
  //     insertAdminOffer.call({ object }, (err2, res2) => {
  //       updateRequest.call(
  //         {
  //           object: {
  //             'logic.lender.offerId': res2,
  //             'logic.lender.chosenTime': new Date(),
  //           },
  //           id: result,
  //         },
  //         () => {
  //           // Weird bug with offer publications that forces me to reload TODO: fix it
  //           location.reload();
  //         },
  //       );
  //     });
  //   });
  // });
};

const purge = (props) => {
  props.loanRequests.forEach(r => deleteRequest.call({ id: r._id }));
  props.borrowers.forEach(r => deleteBorrower.call({ id: r._id }));
  props.offers.forEach(r => deleteOffer.call({ id: r._id }));
};

export default class DevPage extends Component {
  constructor(props) {
    super(props);

    this.state = { twoBorrowers: false };
  }

  componentDidMount() {
    if (!Roles.userIsInRole(this.props.currentUser, 'dev')) {
      this.props.history.push('/app');
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
