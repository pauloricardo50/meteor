/* eslint-env mocha */
import React from 'react';

import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent } from 'core/utils/testHelpers';

import { PublicLayout } from '../PublicLayout';

if (Meteor.isClient) {
  describe('<PublicLayout />', () => {
    let props;
    const component = () =>
      getMountedComponent({ Component: PublicLayout, props, withRouter: true });

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
