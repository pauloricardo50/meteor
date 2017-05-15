import React from 'react';

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';

import PublicLayout from '../PublicLayout.jsx';

if (Meteor.isClient) {
  describe('<PublicLayout />', () => {
    let props;
    const component = () => getMountedComponent(PublicLayout, props, true);

    beforeEach(() => {
      props = {
        children: <span />,
      };
      getMountedComponent.reset();
    });

    it('Renders correctly', () => {
      const divs = component().find('div');

      expect(divs.length).to.be.at.least(1);
    });
  });
}
