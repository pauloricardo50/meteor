// @flow
/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { Factory } from 'meteor/dburles:factory';

import AccountPage from '../../AccountPage';

describe.only('AccountPage', () => {
  let props;
  const component = () => shallow(<AccountPage {...props} />);

  beforeEach(() => {
    props = {};
  });

  context('Developper section', () => {
    // Skip if not in 'pro'
    before(function () {
      if (Meteor.settings.public.microservice !== 'pro') {
        this.skip();
      }
    });

    let alertSpy;
    let currentUser;

    beforeEach(() => {
      alertSpy = sinon.spy(global.window, 'alert');
      currentUser = Factory.create('pro');
    });

    afterEach(() => {
      alertSpy.restore();
    });

    it('renders the developper section when in pro', () => {
      props = { currentUser };
      console.log('aklfdjh', Meteor.settings.public.microservice);
      console.log(component().debug());
      expect(component().find('.developper-section').length).to.equal(1);
    });
  });
});
