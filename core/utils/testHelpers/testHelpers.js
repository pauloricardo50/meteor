import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider, intlShape } from 'react-intl';
import StubCollections from 'meteor/hwillson:stub-collections';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Provider } from 'react-redux';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../lang/fr.json';

// This has to be imported here for client side tests to use factories
// Because each test using factories also uses stubCollections
import 'core/api/factories';

import Loans from 'core/api/loans/loans';
import Borrowers from 'core/api/borrowers/borrowers';
import Offers from 'core/api/offers/offers';
import AdminActions from 'core/api/adminActions/adminActions';
import Comparators from 'core/api/comparators/comparators';
import Properties from 'core/api/properties/properties';
import { mount } from './enzyme';

// Mounts a component for testing, and wraps it around everything it needs
const customMount = ({ Component, props, withRouter, withStore }) => {
    const intlProvider = new IntlProvider(
        {
            locale: getUserLocale(),
            messages: messagesFR,
            formats: getFormats(),
            defaultLocale: 'fr'
        },
        {}
    );
    const { intl } = intlProvider.getChildContext();

    let testComponent = <Component {...props} />;

    if (withRouter) {
        testComponent = (
            <MemoryRouter>
                {React.cloneElement(testComponent, {
                    history: { location: { pathname: '' } }
                })}
            </MemoryRouter>
        );
    }

    if (withStore) {
        const configureStore = require('redux-mock-store');
        const mockStore = configureStore();
        const initialState = { stepper: {} };
        const store = mockStore(initialState);
        testComponent = <Provider store={store}>{testComponent}</Provider>;
    }

    return mount(testComponent, {
        context: { intl },
        childContextTypes: { intl: intlShape }
    });
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
export const getMountedComponent = ({
    Component,
    props,
    withRouter,
    withStore
}) => {
    if (!getMountedComponent.mountedComponent) {
        getMountedComponent.mountedComponent = customMount({
            Component,
            props,
            withRouter,
            withStore
        });
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
        StubCollections.stub([Loans, Borrowers, Offers, Meteor.users]);
    }
};

/**
 * stubCollections - Stubs collections, for tests using Factory package
 * on the client, no frills attached
 *
 * @return {type} undefined
 */
export const stubCollections = () => {
    StubCollections.stub([
        Meteor.users,
        Loans,
        Borrowers,
        Offers,
        AdminActions,
        Properties,
        Comparators
    ]);
};

stubCollections.restore = () => {
    StubCollections.restore();
};

if (Meteor.isTest) {
    // This is some test initialization, stubbing all the collections here,
    // avoids all timeouts coming later due to us using this function.
    console.log('Initializing Tests...');
    resetDatabase();
    StubCollections.add([
        Meteor.users,
        Loans,
        Borrowers,
        Offers,
        AdminActions,
        Properties,
        Comparators
    ]);
    StubCollections.stub(); // This part is critical, need to stub once beforeAll
    stubCollections.restore();

    console.log('Ready to roll');
}
