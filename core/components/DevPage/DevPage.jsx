import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

import { cleanDatabase, migrateToLatest } from 'core/api/methods/index';
import Button from '../Button';
import Icon from '../Icon';
import ConfirmMethod from '../ConfirmMethod';
import DevPageContainer from './DevPageContainer';
import ErrorThrower from './ErrorThrower';

class DevPage extends Component {
  constructor(props) {
    super(props);
    this.state = { twoBorrowers: false, users: 5, numberOfRates: 20 };
  }

  componentDidMount() {
    if (!Roles.userIsInRole(this.props.currentUser, 'dev')) {
      this.props.history.push('/');
    }
  }

  makeHandleChange = stateName => value =>
    this.setState(prev => ({ [stateName]: value }));

  render() {
    const {
      twoBorrowers,
      users,
      addOffers,
      isRefinancing,
      numberOfRates,
      withInvitedBy,
    } = this.state;
    const {
      currentUser,
      addEmptyLoan,
      addLoanWithSomeData,
      purgeAndGenerateDatabase,
      addCompleteLoan,
      addAnonymousLoan,
    } = this.props;
    const showDevStuff = !Meteor.isProduction || Meteor.isStaging || Meteor.isDevEnvironment;

    if (showDevStuff) {
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
                error
                className="mr20"
                onClick={() => Meteor.call('purgeDatabase', currentUser._id)}
              >
                <Icon type="flash" />
                Delete entire database
              </Button>
            </Tooltip>

            <Tooltip title="Use with extra care!!! You will be deleting EVERYTHING in the database and generate new fake data!">
              <Button
                raised
                error
                onClick={() =>
                  purgeAndGenerateDatabase(currentUser._id, currentUser.email)
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
            name="twoBorrowers"
            value={twoBorrowers}
            onChange={() =>
              this.makeHandleChange('twoBorrowers')(!twoBorrowers)
            }
          />
          2 borrowers
          <input
            type="checkbox"
            name="addOffers"
            value={addOffers}
            onChange={() => this.makeHandleChange('addOffers')(!addOffers)}
          />
          Add offers
          <input
            type="checkbox"
            name="isRefinancing"
            value={isRefinancing}
            onChange={() =>
              this.makeHandleChange('isRefinancing')(!isRefinancing)
            }
          />
          Refinancing loan
          <br />
          <Button
            raised
            secondary
            className="mr20"
            onClick={() =>
              addEmptyLoan({ twoBorrowers, addOffers, isRefinancing })
            }
          >
            Empty loan
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() =>
              addLoanWithSomeData({ twoBorrowers, addOffers, isRefinancing })
            }
          >
            Loan with some data
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() =>
              addCompleteLoan({ twoBorrowers, addOffers, isRefinancing })
            }
          >
            Loan - complete
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => addAnonymousLoan()}
          >
            Loan - anonymous
          </Button>
          <hr className="mbt20" />
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
          <hr className="mbt20" />
          Nb. of users
          <input
            type="number"
            value={users}
            onChange={e => this.makeHandleChange('users')(e.target.value)}
          />
          <input
            type="checkbox"
            name="withInvitedBy"
            value={withInvitedBy}
            onChange={() =>
              this.makeHandleChange('withInvitedBy')(!withInvitedBy)
            }
          />
          With invitedBy
          <Button
            raised
            secondary
            className="mr20"
            onClick={() =>
              Meteor.call('createDemoPromotion', {
                users,
                withInvitedBy,
              })
            }
          >
            Créer promotion
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() =>
              Meteor.call('createDemoPromotion', {
                users,
                addCurrentUser: true,
                withPromotionOptions: true,
                withInvitedBy,
              })
            }
          >
            Créer promotion avec moi dedans
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() =>
              Meteor.call('createDemoPromotion', {
                users,
                addCurrentUser: true,
              })
            }
          >
            Créer promotion avec moi dedans, sans promotionOptions
          </Button>
          <hr className="mbt20" />
          Nb. de taux
          <input
            type="number"
            value={numberOfRates}
            onChange={e =>
              this.makeHandleChange('numberOfRates')(e.target.value)
            }
          />
          <Button
            raised
            secondary
            className="mr20"
            onClick={() =>
              Meteor.call('createFakeInterestRates', {
                number: numberOfRates,
              })
            }
          >
            Créer des taux d'intérêt
          </Button>
          <hr className="mbt20" />
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => Meteor.call('addUserToOrg')}
          >
            Add me in org
          </Button>
          <hr className="mbt20" />
          <ConfirmMethod
            method={cb => migrateToLatest().then(cb)}
            keyword="MIGRATE"
            label="Migrate to latest"
            buttonProps={{ error: true, raised: true }}
          />
          <ConfirmMethod
            method={cb => cleanDatabase.run().then(cb)}
            keyword="CLEAN_DATABASE"
            label="Clean database"
            buttonProps={{ error: true, raised: true }}
          />
          <hr className="mbt20" />
          <ErrorThrower />
          <hr className="mbt20" />
          <Button
            raised
            primary
            onClick={() => Meteor.call('generateAllNotifications')}
          >
            Générer notifications
          </Button>
        </section>
      );
    }

    return (
      <section id="dev-page">
        <ConfirmMethod
          method={cb => migrateToLatest.run().then(cb)}
          keyword="MIGRATE"
          label="Migrate to latest"
          buttonProps={{ error: true, raised: true }}
        />
        <ConfirmMethod
          method={cb => cleanDatabase.run().then(cb)}
          keyword="CLEAN_DATABASE"
          label="Clean database"
          buttonProps={{ error: true, raised: true }}
        />
        <ErrorThrower />
      </section>
    );
  }
}

DevPage.propTypes = {
  currentUser: PropTypes.object,
};

DevPage.defaultProps = {
  currentUser: {},
};

export default DevPageContainer(DevPage);
