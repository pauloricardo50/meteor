/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent } from 'core/utils/testHelpers';

import LoginPage from '../LoginPage';

if (Meteor.isClient) {
  describe('<LoginPage />', () => {
    let props;
    const component = () => getMountedComponent(LoginPage, props);

    beforeEach(() => {
      getMountedComponent.reset();
      props = {
        history: {},
        location: {},
      };
    });

    it('Always renders a section', () => {
      const sections = component().find('section');
      expect(sections.length).to.be.at.least(1);
    });
  });
}
