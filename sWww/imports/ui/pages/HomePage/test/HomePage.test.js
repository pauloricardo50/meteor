/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent } from  'core/utils/testHelpers';

import HomePage from '../HomePage';

if (Meteor.isClient) {
  describe('<HomePage />', () => {
    let props;
    const component = () => getMountedComponent(HomePage, props, true);

    beforeEach(() => {
      props = { currentUser: undefined };
      getMountedComponent.reset();
    });

    it('Always renders a section', () => {
      const divs = component().find('div');
      expect(divs.length).to.be.at.least(1);
    });
  });
}
