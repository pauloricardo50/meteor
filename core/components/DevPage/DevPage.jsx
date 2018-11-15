import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '../Button';
import Icon from '../Icon';
import DevPageContainer from './DevPageContainer';
import ErrorThrower from './ErrorThrower';

class DevPage extends Component {
  constructor(props) {
    super(props);
    this.state = { twoBorrowers: false, users: 5 };
  }

  componentDidMount() {
    if (!Roles.userIsInRole(this.props.currentUser, 'dev')) {
      this.props.history.push('/');
    }
  }

  makeHandleChange = stateName => value =>
    this.setState(prev => ({ [stateName]: value }));

  render() {
    const { twoBorrowers, users, addOffers } = this.state;
    const {
      currentUser,
      addEmptyLoan,
      addLoanWithSomeData,
      purgeAndGenerateDatabase,
    } = this.props;
    const showDevStuff = !Meteor.isProduction || Meteor.isStaging;

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
          <br />
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => addEmptyLoan(twoBorrowers, addOffers)}
          >
            Empty loan
          </Button>
          <Button
            raised
            secondary
            className="mr20"
            onClick={() => addLoanWithSomeData(twoBorrowers, addOffers)}
          >
            Loan with some data
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
          <hr className="mbt20" />
          Nb. d'utilisateurs
          <input
            type="number"
            value={users}
            onChange={e => this.makeHandleChange('users')(e.target.value)}
          />
          <Button
            raised
            secondary
            className="mr20"
            onClick={() =>
              Meteor.call('createDemoPromotion', {
                users,
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
          <ErrorThrower />
        </section>
      );
    }

    return (
      <section id="dev-page">
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
