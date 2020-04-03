/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import { expect } from 'chai';
import sinon from 'sinon';

import { ROLES } from '../../api/users/userConstants';
import { getRedirectIfInRoleForOtherApp } from '../redirection';

describe('getRedirectIfInRoleForOtherApp', () => {
  const token = Random.id();

  beforeEach(() => {
    // It's available only on the client.
    Accounts._storedLoginToken = sinon.stub().callsFake(() => token);
  });

  afterEach(() => {
    delete Accounts._storedLoginToken;
  });

  const userWithRole = role => ({ roles: [role] });
  const urlFor = service =>
    `${Meteor.settings.public.subdomains[service]}/login-token/${token}`;

  [
    ['app', [userWithRole(ROLES.PRO), ROLES.PRO, 'pro'], urlFor('pro')],
    ['app', [userWithRole(ROLES.PRO), ROLES.USER, 'app']],
    ['app', [userWithRole(ROLES.USER), ROLES.PRO, 'pro']],
    ['app', [userWithRole(ROLES.USER), ROLES.USER, 'app']],
    ['pro', [userWithRole(ROLES.PRO), ROLES.PRO, 'pro']],
    ['pro', [userWithRole(ROLES.PRO), ROLES.USER, 'app']],
    ['pro', [userWithRole(ROLES.USER), ROLES.PRO, 'pro']],
    ['pro', [userWithRole(ROLES.USER), ROLES.USER, 'app'], urlFor('app')],
  ].forEach(([microservice, args, url]) => {
    it(`Should work in ${microservice} for ${JSON.stringify(args)}`, () => {
      const originalMicroservice = Meteor.settings.public.microservice;
      Meteor.settings.public.microservice = microservice;

      expect(getRedirectIfInRoleForOtherApp(...args)).to.equal(url);

      Meteor.settings.public.microservice = originalMicroservice;
    });
  });
});
