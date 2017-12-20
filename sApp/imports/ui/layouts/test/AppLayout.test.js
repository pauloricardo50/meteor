/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {
  getMountedComponent,
  stubCollections,
} from  'core/utils/testHelpers';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import AppLayout from '../AppLayout';

if (Meteor.isClient) {
  describe('<AppLayout />', () => {
    let props;
    const component = () => getMountedComponent(AppLayout, props, true);

    beforeEach(() => {
      resetDatabase();
      stubCollections();
      const user = Factory.create('dev');
      props = {
        currentUser: user,
        history: {
          location: {
            pathname: '/app',
          },
        },
      };
      getMountedComponent.reset();
    });

    afterEach(() => {
      stubCollections.restore();
    });

    it('Renders correctly', () => {
      const divs = component().find('div');

      expect(divs.length).to.be.at.least(1);
    });
  });
}
