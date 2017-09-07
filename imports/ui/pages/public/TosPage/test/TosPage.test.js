/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import getMountedComponent from '/imports/js/helpers/testHelpers';

import TosPage from '../TosPage';

if (Meteor.isClient) {
  describe('<TosPage />', () => {
    let props;
    const component = () => getMountedComponent(TosPage, props);

    beforeEach(() => {
      getMountedComponent.reset();
    });

    it('Always renders a section', () => {
      const sections = component().find('section');
      expect(sections.length).to.be.at.least(1);
    });
  });
}
