/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {
  getMountedComponent,
  stubCollections,
} from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';

import AppLayout from '../AppLayout';

if (Meteor.isClient) {
  describe('<AppLayout />', () => {
    let props;
    const component = () => getMountedComponent(AppLayout, props, true);

    beforeEach(() => {
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
