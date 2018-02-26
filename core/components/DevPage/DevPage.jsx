import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanMethod from 'core/api/cleanMethods';
import { Roles } from 'meteor/alanning:roles';

import { completeFakeBorrower } from 'core/api/borrowers/fakes';
import { loanStep1, loanStep2, loanStep3 } from 'core/api/loans/fakes';
import { getRandomOffer } from 'core/api/offers/fakes';
import { fakeProperty } from 'core/api/properties/fakes';

const addStep1Loan = (twoBorrowers) => {
  const borrowerIds = [];
  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? cleanMethod('insertBorrower', {
          object: completeFakeBorrower,
        })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return cleanMethod('insertProperty', { object: fakeProperty });
    })
    .then((propertyId) => {
      const loan = loanStep1;
      loan.borrowerIds = borrowerIds;
      loan.propertyId = propertyId;
      cleanMethod('insertLoan', { object: loan });
    })
    .catch(console.log);
};

const addStep2Loan = (twoBorrowers) => {
  const borrowerIds = [];

  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? cleanMethod('insertBorrower', {
          object: completeFakeBorrower,
        })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return cleanMethod('insertProperty', { object: fakeProperty });
    })
    .then((propertyId) => {
      const loan = loanStep2;
      loan.borrowerIds = borrowerIds;
      loan.propertyId = propertyId;
      cleanMethod('insertLoan', { object: loan });
    })
    .catch(console.log);
};

const addStep3Loan = (twoBorrowers, completeFiles = true) => {
  const borrowerIds = [];
  const loan = loanStep3(completeFiles);
  let loanId;
  cleanMethod('insertBorrower', { object: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? cleanMethod('insertBorrower', {
          object: completeFakeBorrower,
        })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return cleanMethod('insertProperty', { object: fakeProperty });
    })
    .then((propertyId) => {
      loan.borrowerIds = borrowerIds;
      loan.propertyId = propertyId;
    })
    .then(() => cleanMethod('insertLoan', { object: loan }))
    .then((id) => {
      loanId = id;
      const object = getRandomOffer(
        { loan: { ...loan, _id: id }, property: fakeProperty },
        true,
      );
      return cleanMethod('insertAdminOffer', { object });
    })
    .then(offerId =>
      cleanMethod('updateLoan', {
        object: {
          'logic.lender.offerId': offerId,
          'logic.lender.chosenTime': new Date(),
        },
        id: loanId,
      }))
    .then(() => {
      // Weird bug with offers publications that forces me to reload TODO: fix it
      location.reload();
    })
    .catch(console.log);
};

const purge = (props) => {
  const { users, borrowers, properties, loans, tasks, offers } = props;
  console.log('purge');
  cleanMethod('deleteAllBorrowers', { borrowers });
  cleanMethod('deleteAllLoans', { loans });
  cleanMethod('deleteAllOffers', { offers });
  cleanMethod('deleteAllProperties', { properties });
  cleanMethod('deleteAllTasks', { tasks });
  cleanMethod('deleteAllUsers', { users });
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
    const { loading, users } = this.props;

    return (
      <div>
        <input
          type="checkbox"
          name="vehicle"
          value={twoBorrowers}
          onChange={this.handleChange}
        />
        2 borrowers<br />
        <button onClick={() => addStep1Loan(twoBorrowers)}>step 1 Loan</button>
        <button onClick={() => addStep2Loan(twoBorrowers)}>step 2 Loan</button>
        <button onClick={() => addStep3Loan(twoBorrowers)}>step 3 Loan</button>
        <button onClick={() => addStep3Loan(twoBorrowers, false)}>
          step 3 Loan, few files
        </button>
        { users.length <= 1 && <button onClick={() => Meteor.call('generateTestData')}>Generate test data</button>}
        { !loading && users.length > 1 && <button onClick={() => purge(this.props)}>Purge</button>}
      </div>
    );
  }
}

DevPage.propTypes = {
  loading: PropTypes.bool,
  loans: PropTypes.arrayOf(PropTypes.object),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  offers: PropTypes.arrayOf(PropTypes.object),
  properties: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
  tasks: PropTypes.arrayOf(PropTypes.object),
};

DevPage.defaultProps = {
  loading: true,
  loans: [],
  borrowers: [],
  offers: [],
  properties: [],
  users: [],
  tasks: [],
};

