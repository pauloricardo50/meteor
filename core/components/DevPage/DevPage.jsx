import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React, { Component, useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import SimpleSchema from 'simpl-schema';

import {
  cleanDatabase,
  getMigrationControl,
  migrateTo,
  migrateToLatest,
  revertLastMigration,
  unlockMigrationControl,
} from '../../api/methods/methodDefinitions';
import { AutoFormDialog } from '../AutoForm2';
import Button from '../Button';
import ConfirmMethod from '../ConfirmMethod';
import Icon from '../Icon';
import DevPageContainer from './DevPageContainer';
import ErrorThrower from './ErrorThrower';

const migrationVersionSchema = new SimpleSchema({
  version: {
    type: SimpleSchema.Integer,
    uniforms: { label: 'Version', placeholder: '' },
  },
});

const Migrations = () => {
  const [control, setControl] = useState();

  const getControl = async () => {
    const { version, locked } = await getMigrationControl.run({});
    setControl({ version, locked });
  };

  useEffect(() => {
    getControl();
  }, [control?.version, control?.locked]);

  return (
    <>
      <h4 className="flex center-align">
        Current migration version: <b>{control?.version}</b>
        {control?.locked && (
          <div className="ml-16 flex center-align">
            <b className="error ml-16">Control is locked!</b>
            <ConfirmMethod
              method={cb =>
                unlockMigrationControl
                  .run()
                  .then(cb)
                  .finally(() => {
                    getControl();
                  })
              }
              keyword="UNLOCK"
              label="Unlock control"
              buttonProps={{ error: true, raised: true, className: 'ml-16' }}
            />
          </div>
        )}
      </h4>
      <ConfirmMethod
        method={cb =>
          migrateToLatest
            .run()
            .then(cb)
            .finally(() => {
              getControl();
            })
        }
        keyword="MIGRATE"
        label="Migrate to latest"
        buttonProps={{ error: true, raised: true, disabled: control?.locked }}
      />
      <ConfirmMethod
        method={cb =>
          revertLastMigration
            .run()
            .then(cb)
            .finally(() => {
              getControl();
            })
        }
        keyword="REVERT"
        label="Revert last migration"
        buttonProps={{ error: true, raised: true, disabled: control?.locked }}
      />
      <AutoFormDialog
        buttonProps={{
          label: 'Migrate to specific version',
          raised: true,
          error: true,
          disabled: control?.locked,
        }}
        title="Migrate to version"
        schema={migrationVersionSchema}
        onSubmit={params =>
          migrateTo.run(params).finally(() => {
            getControl();
          })
        }
      />
      <ConfirmMethod
        method={cb => cleanDatabase.run().then(cb)}
        keyword="CLEAN_DATABASE"
        label="Clean database"
        buttonProps={{ error: true, raised: true }}
      />
    </>
  );
};

const SharedStuff = () => (
  <>
    <Migrations />
    <ErrorThrower />
  </>
);

const testPromotionSchema = new SimpleSchema({
  promotionName: {
    type: String,
    defaultValue: 'Promo test',
    uniforms: { label: 'Nom de la promotion' },
  },
  lots: {
    type: Number,
    min: 1,
    max: 500,
    defaultValue: 50,
    uniforms: { label: 'Nombre de lots' },
  },
  pros: {
    type: Number,
    min: 1,
    max: 50,
    defaultValue: 10,
    uniforms: { label: 'Nombre de courtiers' },
  },
  users: {
    type: Number,
    min: 1,
    max: 2000,
    defaultValue: 25,
    uniforms: { label: 'Nombre de clients' },
  },
  promotionOptionsPerUser: {
    type: Number,
    min: 1,
    max: 5,
    defaultValue: 3,
    uniforms: { label: 'Nombre de lots max par client' },
  },
});

class DevPage extends Component {
  constructor(props) {
    super(props);
    this.state = { twoBorrowers: false, numberOfRates: 20 };
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
      addOffers,
      isRefinancing,
      numberOfRates,
    } = this.state;
    const {
      currentUser,
      addEmptyLoan,
      addLoanWithSomeData,
      purgeAndGenerateDatabase,
      addCompleteLoan,
      addAnonymousLoan,
      history,
    } = this.props;
    const showDevStuff =
      !Meteor.isProduction || Meteor.isStaging || Meteor.isDevEnvironment;

    if (showDevStuff) {
      return (
        <section id="dev-page">
          <>
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
          </>
          <hr className="mbt20" />
          <Tooltip title="Generate fake users, loans, borrowers, properties, tasks and offers">
            <Button
              raised
              secondary
              className="mr20"
              onClick={() =>
                Meteor.call('generateTestData', {
                  currentUserEmail: currentUser.email,
                  generateDevs: true,
                  generateAdmins: true,
                  generateUsers: true,
                  generateOrganisations: true,
                  generateUnownedLoan: true,
                  generateTestUser: true,
                })
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
          <AutoFormDialog
            buttonProps={{
              label: 'Créer promotion',
              raised: true,
              secondary: true,
            }}
            title="Créer promotion"
            schema={testPromotionSchema}
            onSubmit={params =>
              new Promise((resolve, reject) => {
                Meteor.call('createTestPromotion', params, (err, res) =>
                  err ? reject(err) : resolve(res),
                );
              }).then(promotionId => history.push(`/promotions/${promotionId}`))
            }
          />
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
          <Button
            raised
            primary
            onClick={() => Meteor.call('generateAllNotifications')}
          >
            Générer notifications
          </Button>
          <hr className="mbt20" />
          <SharedStuff />
        </section>
      );
    }

    return (
      <section id="dev-page">
        <SharedStuff />
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
