import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';

import HomePage from '../HomePage.jsx';

if (Meteor.isClient) {
  describe('<HomePage />', () => {
    let props;
    let mountedComponent;
    const component = () => getMountedComponent(HomePage, props, mountedComponent);

    beforeEach(() => {
      props = { currentUser: undefined };
      mountedComponent = undefined;
    });

    it('Always renders a section', () => {
      const sections = component().find('template');
      expect(sections.length).to.be.at.least(1);
    });
  });
}
