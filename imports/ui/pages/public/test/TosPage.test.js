import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';

import TosPage from '../TosPage.jsx';

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
