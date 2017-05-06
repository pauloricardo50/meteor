import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';

import Start1Page from '../Start1Page.jsx';

if (Meteor.isClient) {
  describe('<Start1Page />', () => {
    let props;
    const component = () => getMountedComponent(Start1Page, props);

    beforeEach(() => {
      props = { match: { params: {} } };
      getMountedComponent.reset();
    });

    it('Always renders a section', () => {
      const sections = component().find('section');

      expect(sections.length).to.be.at.least(1);
      expect(sections.first().hasClass('oscar')).to.be.true;
    });
  });
}
