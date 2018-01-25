/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent } from 'core/utils/testHelpers';

import AboutPage from '../AboutPage';

if (Meteor.isClient) {
  describe('<AboutPage />', () => {
    let props;
    const component = () =>
      getMountedComponent({ Component: AboutPage, props });

    beforeEach(() => {
      getMountedComponent.reset();
    });

    it('Always renders a section', () => {
      const sections = component().find('section');
      expect(sections.length).to.be.at.least(1);
    });
  });
}
