// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import SecurityService from '../../..';
import PromotionService from '../../../../promotions/PromotionService';
import { DOCUMENT_USER_PERMISSIONS } from '../../../constants';
import { SECURITY_ERROR } from '../../../Security';

describe.only('module', () => {
  let userId;
  beforeEach(() => {
    resetDatabase();
  });

  beforeEach(() => {
    sinon.stub(Meteor, 'userId').callsFake(() => userId);
  });

  afterEach(() => {
    if (Meteor.userId.restore) {
      Meteor.userId.restore();
    }
  });

  describe('isAllowedToRead', () => {
    it('throws if the user has no loan linked to this promotion', () => {
      userId = Factory.create('user')._id;
      const promotionId = Factory.create('promotion')._id;

      expect(() =>
        SecurityService.promotions.isAllowedToRead(promotionId, userId)).to.throw(SECURITY_ERROR);
    });

    it('does not throw if the user has a loan linked to this promotion', () => {
      userId = Factory.create('user')._id;
      const loanId = Factory.create('loan', { userId })._id;
      const promotionId = Factory.create('promotion')._id;

      PromotionService.addLink({
        id: promotionId,
        linkName: 'loans',
        linkId: loanId,
      });

      expect(() =>
        SecurityService.promotions.isAllowedToRead(promotionId, userId)).to.not.throw();
    });

    it('does not throw if the user is a PRO with READ on it', () => {
      userId = Factory.create('pro')._id;
      const promotionId = Factory.create('promotion')._id;
      PromotionService.addLink({
        id: promotionId,
        linkName: 'users',
        linkId: userId,
        metadata: { permissions: DOCUMENT_USER_PERMISSIONS.READ },
      });

      expect(() =>
        SecurityService.promotions.isAllowedToRead(promotionId, userId)).to.not.throw();
    });

    it('does not throw if the user is a PRO with MODIFY on it', () => {
      userId = Factory.create('pro')._id;
      const promotionId = Factory.create('promotion')._id;
      PromotionService.addLink({
        id: promotionId,
        linkName: 'users',
        linkId: userId,
        metadata: { permissions: DOCUMENT_USER_PERMISSIONS.MODIFY },
      });

      expect(() =>
        SecurityService.promotions.isAllowedToRead(promotionId, userId)).to.not.throw();
    });
  });
});
