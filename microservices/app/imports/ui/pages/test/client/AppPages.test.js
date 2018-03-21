/* eslint-env mocha */
import { expect } from 'chai';

import {
  getMountedComponent,
  stubCollections,
  generateData,
} from 'core/utils/testHelpers';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import DashboardPage from '../../DashboardPage';

const pages = { DashboardPage };

describe('App pages ', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();
  });
  afterEach(() => {
    stubCollections.restore();
  });
  Object.keys(pages).forEach((pageName) => {
    const Page = pages[pageName];

    describe(`Basic tests for ${pageName}`, () => {
      let props;
      const component = () =>
        getMountedComponent({
          Component: Page,
          props,
          withRouter: true,
          withStore: false,
        });

      beforeEach(() => {
        getMountedComponent.reset();
        const data = generateData({ user: { roles: 'dev' } });
        props = {
          ...data,
          currentUser: data.user,
          location: {},
          history: {},
          match: {
            params: {
              borrowerId: data.borrowers[0]._id,
              loanId: data.loan._id,
            },
          },
        };
      });

      it('renders without crashing', () => {
        const sections = component().find('section');
        expect(sections.length).to.be.at.least(1);
      });
    });
  });
});
