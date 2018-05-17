import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import Tooltip from 'material-ui/Tooltip';
import {
  completeFakeBorrower,
  emptyFakeBorrower,
} from '../../api/borrowers/fakes';
import {
  loanStep1,
  loanStep2,
  loanStep3,
  emptyLoan,
} from '../../api/loans/fakes';
import { getRandomOffer } from '../../api/offers/fakes';
import { fakeProperty, emptyProperty } from '../../api/properties/fakes';
import {
  borrowerInsert,
  propertyInsert,
  loanInsert,
  offerInsert,
  loanUpdate,
} from '../../api';
import Button from '../Button';
import Icon from '../Icon';

const addEmptyStep1Loan = (twoBorrowers) => {
  const borrowerIds = [];
  borrowerInsert
    .run({ borrower: emptyFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? borrowerInsert.run({ borrower: emptyFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return propertyInsert.run({ property: emptyProperty });
    })
    .then((propertyId) => {
      const loan = emptyLoan;
      loan.borrowerIds = borrowerIds;
      loan.propertyId = propertyId;
      loanInsert.run({ loan });
    })
    .catch(console.log);
};

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

  purgeAndGenerateDatabase = (currentUserId, currentUserEmail) => {
    Meteor.call('purgeDatabase', currentUserId, (err, res) => {
      if (err) {
        alert(err.reason);
      } else {
        Meteor.call('generateTestData', currentUserEmail);
      }
    });
  };

  render() {
    const { twoBorrowers } = this.state;
    const { currentUser } = this.props;

    if (!Meteor.isProduction || Meteor.isStaging) {
      return (
        <div>
          <div>
            {!Meteor.isDevelopment ? (
              <h4 className="error">
                You are on a shared database. Avoid touching these buttons if
                you're on a shared database, unless it is absolutely necessary!
                Try to use Delete fake data or Delete personal data instead!
              </h4>
            ) : (
              <h4 className="success">
                You're on a dev environment, do whatever you want! :)
              </h4>
            )}

            <Tooltip title="Use with extra care!!! You will be deleting EVERYTHING in the database except your personal account!">
              <Button
                raised
                className="error mr20"
                onClick={() => Meteor.call('purgeDatabase', currentUser._id)}
              >
                <Icon type="flash" />
                Delete entire database
              </Button>
            </Tooltip>

            <Tooltip title="Use with extra care!!! You will be deleting EVERYTHING in the database and generate new fake data!">
              <Button
                raised
                className="error mr20"
                onClick={() =>
                  this.purgeAndGenerateDatabase(
                    currentUser._id,
                    currentUser.emails[0].address,
                  )
                }
              >
                <Icon type="report" />
                Purge database & Generate test data
              </Button>
            </Tooltip>
          </div>
          <hr className="mbt20" />
          <Tooltip title="Generate fake users, loans, borrowers, properties, tasks and offers">
            <Button
              raised
              secondary
              className="mr20"
              onClick={() =>
                Meteor.call('generateTestData', currentUser.emails[0].address)
              }
            >
              <Icon type="groupAdd" />
              Generate test data
            </Button>
          </Tooltip>
          <Tooltip title="Delete fake users and related loans, borrowers, properties, tasks and offers">
            <Button
              raised
              className="warning mr20"
              onClick={() => Meteor.call('purgeFakeData', currentUser._id)}
            >
              <Icon type="deleteSweep" />
              Delete test data
            </Button>
          </Tooltip>
          <Tooltip title="Delete personal data: loans, borrowers, properties, tasks and offers">
            <Button
              raised
              className="warning mr20"
              onClick={() => Meteor.call('purgePersonalData', currentUser._id)}
            >
              <Icon type="deleteForever" />
              Delete personal data
            </Button>
          </Tooltip>
          <hr className="mbt20" />
          <input
            type="checkbox"
            name="vehicle"
            value={twoBorrowers}
            onChange={this.handleChange}
          />
          2 borrowers<br />
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => addEmptyStep1Loan(twoBorrowers)}
          >
            Empty step 1 Loan
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => addStep1Loan(twoBorrowers)}
          >
            step 1 Loan
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => addStep2Loan(twoBorrowers)}
          >
            step 2 Loan
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => addStep3Loan(twoBorrowers)}
          >
            step 3 Loan
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => addStep3Loan(twoBorrowers, false)}
          >
            step 3 Loan, few files
          </Button>
          <hr className="mbt20" />
          <Tooltip title="Insert task related to a random borrower">
            <Button
              raised
              secondary
              className="mr20"
              onClick={() => Meteor.call('insertBorrowerRelatedTask')}
            >
              Borrower Task
            </Button>
          </Tooltip>
          <Tooltip title="Insert task related to a random loan">
            <Button
              raised
              secondary
              className="mr20"
              onClick={() => Meteor.call('insertLoanRelatedTask')}
            >
              Loan Task
            </Button>
          </Tooltip>
          <Tooltip title="Insert task related to a random property">
            <Button
              raised
              secondary
              className="mr20"
              onClick={() => Meteor.call('insertPropertyRelatedTask')}
            >
              Property Task
            </Button>
          </Tooltip>
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
