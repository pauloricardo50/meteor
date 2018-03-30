import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import Tooltip from 'material-ui/Tooltip';
import { completeFakeBorrower } from '../../api/borrowers/fakes';
import { loanStep1, loanStep2, loanStep3 } from '../../api/loans/fakes';
import { getRandomOffer } from '../../api/offers/fakes';
import { fakeProperty } from '../../api/properties/fakes';
import {
  borrowerInsert,
  propertyInsert,
  loanInsert,
  offerInsert,
  loanUpdate,
} from '../../api';
import Button from '../Button';
import Icon from '../Icon';

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
  }

  render() {
    const { twoBorrowers } = this.state;
    const { currentUser } = this.props;

    if (!Meteor.isProduction || Meteor.isStaging) {
      return (

        <div>
          <div>
            <h4 className="error"> Avoid touching these buttons unless it is absolutely necessary! Try to use Delete fake data or Delete personal data instead!</h4>
            <Tooltip
              title="Use with extra care!!! You will be deleting EVERYTHING in the database except your personal account!"
            >
              <Button
                raised
                className="error"
                onClick={() => Meteor.call('purgeDatabase', currentUser._id)}
              >
                <Icon type="flash" />
                Delete entire database
              </Button>

            </Tooltip>

            <Tooltip title="Use with extra care!!! You will be deleting EVERYTHING in the database and generate new fake data!">
              <Button
                raised
                className="error"
                onClick={() => this.purgeAndGenerateDatabase(currentUser._id, currentUser.emails[0].address)}
              >
                <Icon type="report" />
                Purge database & Generate test data
              </Button>
            </Tooltip>
          </div>
          <hr />
          <Tooltip title="Generate fake users, loans, borrowers, properties, tasks and offers">
            <Button
              raised
              secondary
              onClick={() => Meteor.call('generateTestData', currentUser.emails[0].address)}
            >
              <Icon type="groupAdd" />
              Generate test data
            </Button>
          </Tooltip>

          <Tooltip title="Delete fake users and related loans, borrowers, properties, tasks and offers">
            <Button
              raised
              className="warning"
              onClick={() => Meteor.call('purgeFakeData', currentUser._id)}
            >
              <Icon type="deleteSweep" />
              Delete test data
            </Button>
          </Tooltip>

          <Tooltip title="Delete personal data: loans, borrowers, properties, tasks and offers">
            <Button
              raised
              className="warning"
              onClick={() => Meteor.call('purgePersonalData', currentUser._id)}
            >
              <Icon type="deleteForever" />
              Delete personal data
            </Button>
          </Tooltip>
          <hr />
          <input
            type="checkbox"
            name="vehicle"
            value={twoBorrowers}
            onChange={this.handleChange}
          />
          2 borrowers<br />
          <Button raised secondary onClick={() => addStep1Loan(twoBorrowers)}>
            step 1 Loan
          </Button>
          <Button raised secondary onClick={() => addStep2Loan(twoBorrowers)}>
            step 2 Loan
          </Button>
          <Button raised secondary onClick={() => addStep3Loan(twoBorrowers)}>
            step 3 Loan
          </Button>
          <Button raised secondary onClick={() => addStep3Loan(twoBorrowers, false)}>
            step 3 Loan, few files
          </Button>
          <hr />
          <Tooltip title="Insert task related to a random borrower">
            <Button raised secondary onClick={() => Meteor.call('insertBorrowerRelatedTask')}>
              Borrower Task
            </Button>
          </Tooltip>
          <Tooltip title="Insert task related to a random loan">
            <Button raised secondary onClick={() => Meteor.call('insertLoanRelatedTask')}>
              Loan Task
            </Button>
          </Tooltip>
          <Tooltip title="Insert task related to a random property">
            <Button raised secondary onClick={() => Meteor.call('insertPropertyRelatedTask')}>
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
