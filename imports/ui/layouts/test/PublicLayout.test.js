/* eslint-env mocha */
import React from 'react';

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import getMountedComponent from '/imports/js/helpers/testHelpers';

import PublicLayout from '../PublicLayout';

if (Meteor.isClient) {
  describe('<PublicLayout />', () => {
    let props;
    const component = () => getMountedComponent(PublicLayout, props, true);

    beforeEach(() => {
      getMountedComponent.reset();
      props = {};
    });

    it('Renders correctly', () => {
      const divs = component().find('div');

      expect(divs.length).to.be.at.least(1);
    });
  });
}
