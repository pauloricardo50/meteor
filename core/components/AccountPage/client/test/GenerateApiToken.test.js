// @flow
/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { expect } from 'chai';
import { mount } from 'core/utils/testHelpers/enzyme';
import sinon from 'sinon';

import { resetDatabase } from 'meteor/xolvio:cleaner';

import GenerateApiToken from '../../DevelopperSection/GenerateApiToken';
import { userLogin } from '../../../../utils/testHelpers/testHelpers';
import { ROLES } from '../../../../api/constants';
import { generateApiToken } from '../../../../api';

describe('GenerateApiToken', () => {
  let props;
  let confirmSpy;
  let generateApiTokenSpy;

  const component = () => mount(<GenerateApiToken {...props} />);

  // Skip if not in 'pro'
  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.skip();
    }
  });

  beforeEach(() => {
    resetDatabase();
    props = {};
    generateApiTokenSpy = sinon.spy(generateApiToken, 'run');
  });

  afterEach(() => {
    confirmSpy.restore();
    generateApiTokenSpy.restore();
  });

  const makeAlertSpy = (fakeFunc) => {
    confirmSpy = sinon.stub(window, 'confirm').callsFake(fakeFunc);
  };

  it('displays an alert when the button is clicked', () =>
    userLogin({ role: ROLES.PRO }).then((user) => {
      makeAlertSpy(() => false);
      props = { user };
      component()
        .find('button')
        .at(0)
        .simulate('click');
      expect(confirmSpy.called).to.equal(true);
      expect(generateApiTokenSpy.called).to.equal(false);
    }));

  it('generates a new token if the alert is confirmed', () =>
    userLogin({ role: ROLES.PRO }).then((user) => {
      makeAlertSpy(() => true);
      props = { user };
      component()
        .find('button')
        .at(0)
        .simulate('click');
      expect(confirmSpy.called).to.equal(true);
      expect(generateApiTokenSpy.called).to.equal(true);
    }));
});
