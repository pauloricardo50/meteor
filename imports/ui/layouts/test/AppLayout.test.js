import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';

import AppLayout from '../AppLayout.jsx';

if (Meteor.isClient) {
  describe('<AppLayout />', () => {
    let props;
    const component = () => getMountedComponent(AppLayout, props, true);

    beforeEach(() => {
      const user = Factory.create('dev');
      props = { currentUser: user };
      getMountedComponent.reset();
    });

    it('Renders correctly', () => {
      const divs = component().find('div');

      expect(divs.length).to.be.at.least(1);
    });
  });
}
