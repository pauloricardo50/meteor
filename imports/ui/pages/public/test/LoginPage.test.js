import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';

import LoginPage from '../LoginPage.jsx';

if (Meteor.isClient) {
  describe('<LoginPage />', () => {
    let props;
    const component = () => getMountedComponent(LoginPage, props);

    beforeEach(() => {
      getMountedComponent.reset();
      props = {
        history: {},
      };
    });

    it('Always renders a section', () => {
      const sections = component().find('section');
      expect(sections.length).to.be.at.least(1);
    });
  });
}
