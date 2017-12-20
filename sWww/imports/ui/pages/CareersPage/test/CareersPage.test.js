/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent } from  'core/utils/testHelpers';

import CareersPage from '../CareersPage';

if (Meteor.isClient) {
  describe('<CareersPage />', () => {
    let props;
    const component = () => getMountedComponent(CareersPage, props);

    beforeEach(() => {
      getMountedComponent.reset();
    });

    it('Always renders a section', () => {
      const sections = component().find('section');
      expect(sections.length).to.be.at.least(1);
    });
  });
}
