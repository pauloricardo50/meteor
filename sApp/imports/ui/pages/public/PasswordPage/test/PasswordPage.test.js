/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent } from '/imports/js/helpers/testHelpers';

import PasswordPage from '../PasswordPage';

if (Meteor.isClient) {
  describe('<PasswordPage />', () => {
    let props;
    const component = () => getMountedComponent(PasswordPage, props);

    beforeEach(() => {
      getMountedComponent.reset();
    });

    it('Always renders a main', () => {
      const sections = component().find('main');
      expect(sections.length).to.be.at.least(1);
    });
  });
}
