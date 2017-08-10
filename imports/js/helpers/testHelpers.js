import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider, intlShape } from 'react-intl';
import StubCollections from 'meteor/hwillson:stub-collections';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {
  getUserLocale,
  getTranslations,
  getFormats,
} from '/imports/startup/localization';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Borrowers from '/imports/api/borrowers/borrowers';
import Offers from '/imports/api/offers/offers';
import AdminActions from '/imports/api/adminActions/adminActions';
import Comparators from '/imports/api/comparators/comparators';
import Properties from '/imports/api/properties/properties';

// Mounts a component for testing, and wraps it around everything it needs
const customMount = (Component, props, withRouter) => {
  const intlProvider = new IntlProvider(
    {
      locale: getUserLocale(),
      messages: getTranslations(),
      formats: getFormats(),
      defaultLocale: 'fr',
    },
    {},
  );
  const { intl } = intlProvider.getChildContext();

  return mount(
    withRouter
      ? <MemoryRouter>
        <Component history={{ location: { pathname: '' } }} {...props} />
      </MemoryRouter>
      : <Component {...props} />,
    {
      context: {
        muiTheme: getMuiTheme(myTheme),
        intl,
      },
      childContextTypes: {
        muiTheme: PropTypes.object,
        intl: intlShape,
      },
    },
  );
};

/**
 * getMountedComponent - Returns a mounted component with all the required
 * wrappers for testing
 *
 * @param {object} Component  A React component
 * @param {object} props      optional props to be passed into the component
 * @param {boolean} withRouter Wraps the component with a mocked router if this
 * component uses any of the react-router-dom components, like Link or NavLink
 *
 * @return {object} A mounted component, ready for testing with Enzyme
 */
const getMountedComponent = (Component, props, withRouter) => {
  if (!getMountedComponent.mountedComponent) {
    getMountedComponent.mountedComponent = customMount(
      Component,
      props,
      withRouter,
    );
  }
  return getMountedComponent.mountedComponent;
};

/**
* Unknown - Resets the component, to be called in beforeEach hooks
*
* @return {type} undefined
*/
getMountedComponent.reset = (useStubs = true) => {
  getMountedComponent.mountedComponent = undefined;
  if (useStubs) {
    StubCollections.restore();
    StubCollections.stub([LoanRequests, Borrowers, Offers, Meteor.users]);
  }
};

export default getMountedComponent;

/**
 * stubCollections - Stubs collections, for tests using Factory package
 * on the client, no frills attached
 *
 * @return {type} undefined
 */
export const stubCollections = () => {
  StubCollections.stub();
};

stubCollections.restore = () => {
  StubCollections.restore();
};

if (Meteor.isTest) {
  // This is some test initialization, stubbing all the collections here,
  // avoids all timeouts coming later due to us using this function.
  console.log('Initializing Tests...');
  StubCollections.add([
    Meteor.users,
    LoanRequests,
    Borrowers,
    Offers,
    AdminActions,
    Properties,
    Comparators,
  ]);
  StubCollections.stub(); // This part is critical, need to stub once beforeAll
  stubCollections.restore();

  if (Meteor.isClient) {
    injectTapEventPlugin(); // Removes any warnings with onTouchTap during tests
  }

  console.log('Ready to roll');
}
