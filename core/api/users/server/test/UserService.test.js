/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';

import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubCollections } from '../../../../utils/testHelpers';
import UserService from '../../UserService';

describe('UserService', () => {
  const firstName = 'testFirstName';
  const lastName = 'testLastName';
  let user;

  beforeEach(() => {
    resetDatabase();
    stubCollections();

    user = Factory.create('user', { firstName, lastName });
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('getUserById', () => {
    it('returns a user', () =>
      expect(UserService.getUserById({ userId: user._id })).to.deep.equal(user));
  });
});
