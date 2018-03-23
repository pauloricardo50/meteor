import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';

import { completeFakeBorrower } from 'core/api/borrowers/fakes';
import { loanStep1, loanStep2, loanStep3 } from 'core/api/loans/fakes';
import { getRandomOffer } from 'core/api/offers/fakes';
import { fakeProperty } from 'core/api/properties/fakes';
import {
  borrowerInsert,
  propertyInsert,
  loanInsert,
  offerInsert,
  loanUpdate,
} from 'core/api';

const addStep1Loan = (twoBorrowers) => {
  const borrowerIds = [];
  borrowerInsert
    .run({ borrower: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? borrowerInsert.run({ borrower: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return propertyInsert.run({ property: fakeProperty });
    })
    .then((propertyId) => {
      const loan = loanStep1;
      loan.borrowerIds = borrowerIds;
      loan.propertyId = propertyId;
      loanInsert.run({ loan });
    })
    .catch(console.log);
};

const addStep2Loan = (twoBorrowers) => {
  const borrowerIds = [];

  borrowerInsert
    .run({ borrower: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? borrowerInsert.run({ borrower: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return propertyInsert.run({ property: fakeProperty });
    })
    .then((propertyId) => {
      const loan = loanStep2;
      loan.borrowerIds = borrowerIds;
      loan.propertyId = propertyId;
      loanInsert.run({ loan });
    })
    .catch(console.log);
};

const addStep3Loan = (twoBorrowers, completeFiles = true) => {
  const borrowerIds = [];
  const loan = loanStep3(completeFiles);
  let loanId;
  borrowerInsert
    .run({ borrower: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? borrowerInsert.run({ borrower: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return propertyInsert.run({ property: fakeProperty });
    })
    .then((propertyId) => {
      loan.borrowerIds = borrowerIds;
      loan.propertyId = propertyId;
    })
    .then(() => loanInsert.run({ loan }))
    .then((id) => {
      loanId = id;
      const object = getRandomOffer(
        { loan: { ...loan, _id: id }, property: fakeProperty },
        true,
      );
      return offerInsert.run({ offer: object, loanId });
    })
    .then(offerId =>
      loanUpdate.run({
        object: {
          'logic.lender.offerId': offerId,
          'logic.lender.chosenTime': new Date(),
        },
        loanId,
      }))
    .then(() => {
      // Weird bug with offers publications that forces me to reload TODO: fix it
      location.reload();
    })
    .catch(console.log);
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
    const { currentUser } = this.props;

    if (!Meteor.isProduction || Meteor.isStaging) {
      return (
        <div>
          <input
            type="checkbox"
            name="vehicle"
            value={twoBorrowers}
            onChange={this.handleChange}
          />
          2 borrowers<br />
          <button onClick={() => addStep1Loan(twoBorrowers)}>
            step 1 Loan
          </button>
          <button onClick={() => addStep2Loan(twoBorrowers)}>
            step 2 Loan
          </button>
          <button onClick={() => addStep3Loan(twoBorrowers)}>
            step 3 Loan
          </button>
          <button onClick={() => addStep3Loan(twoBorrowers, false)}>
            step 3 Loan, few files
          </button>
          <button onClick={() => Meteor.call('generateTestData', currentUser.emails[0].address)}>
            Generate test data
          </button>
          <button onClick={() => Meteor.call('purgeDatabase', currentUser._id)}>
            Purge
          </button>
          <br /> <br />
          <p>Insert task related to a random borrower</p>
          <button onClick={() => Meteor.call('insertBorrowerRelatedTask')}>
            Borrower Task
          </button>
          <br />
          <p>Insert task related to a random loan</p>
          <button onClick={() => Meteor.call('insertLoanRelatedTask')}>
            Loan Task
          </button>
          <br />
          <p>Insert task related to a random property</p>
          <button onClick={() => Meteor.call('insertPropertyRelatedTask')}>
            Property Task
          </button>
        </div>
      );
    }
    return null;
  }
}

DevPage.propTypes = {
  currentUser: PropTypes.object,
};

DevPage.defaultProps = {
  currentUser: {},
};
