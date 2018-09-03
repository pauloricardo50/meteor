import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '../Button';
import Icon from '../Icon';
import DevPageContainer from './DevPageContainer';

class DevPage extends Component {
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
    const {
      currentUser,
      addEmptyStep1Loan,
      addStep1Loan,
      addStep2Loan,
      addStep3Loan,
    } = this.props;

    if (!Meteor.isProduction || Meteor.isStaging) {
      return (
        <section id="dev-page">
          <React.Fragment>
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
                    currentUser.email,
                  )
                }
              >
                <Icon type="report" />
                Purge database & Generate test data
              </Button>
            </Tooltip>
          </React.Fragment>
          <hr className="mbt20" />
          <Tooltip title="Generate fake users, loans, borrowers, properties, tasks and offers">
            <Button
              raised
              secondary
              className="mr20"
              onClick={() => Meteor.call('generateTestData', currentUser.email)}
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
          2 borrowers
          <br />
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
        </section>
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

export default DevPageContainer(DevPage);
