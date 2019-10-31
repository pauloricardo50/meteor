// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { up, down } from '../26';
import PromotionLotService from '../../../promotionLots/server/PromotionLotService';
import PromotionService from '../../../promotions/server/PromotionService';
import UserService from '../../../users/server/UserService';

describe('Migration 26', () => {
  beforeEach(() => resetDatabase());

  describe('up', () => {
    it('sets all BOOKED promotionLots to RESERVED', async () => {
      await PromotionLotService.rawCollection.insert({
        _id: 'a',
        status: 'BOOKED',
      });
      await PromotionLotService.rawCollection.insert({
        _id: 'b',
        status: 'SOLD',
      });
      await PromotionLotService.rawCollection.insert({
        _id: 'c',
        status: 'AVAILABLE',
      });

      await up();

      const [pL1, pL2, pL3] = PromotionLotService.find().fetch();

      expect(pL1.status).to.equal('RESERVED');
      expect(pL2.status).to.equal('SOLD');
      expect(pL3.status).to.equal('AVAILABLE');
    });

    it('updates promotion permissions', async () => {
      await UserService.rawCollection.insert({ _id: 'a' });
      await UserService.rawCollection.insert({ _id: 'b' });
      await UserService.rawCollection.insert({ _id: 'c' });
      await PromotionService.rawCollection.insert({
        _id: 'a',
        userLinks: [
          {
            _id: 'a',
            permissions: {
              canBookLots: true,
              displayCustomerNames: {
                forLotStatus: ['BOOKED', 'SOLD'],
                invitedBy: 'USER',
              },
              canModifyPromotion: true,
            },
          },
          {
            _id: 'b',
            permissions: {
              canBookLots: false,
              displayCustomerNames: {
                forLotStatus: ['SOLD'],
                invitedBy: 'USER',
              },
              canModifyPromotion: true,
            },
          },
          {
            _id: 'c',
            permissions: {
              canBookLots: true,
              displayCustomerNames: false,
              canModifyPromotion: true,
            },
          },
        ],
      });

      await up();

      const { userLinks = [] } = PromotionService.findOne({ _id: 'a' });
      const [
        { permissions: permissions1 },
        { permissions: permissions2 },
        { permissions: permissions3 },
      ] = userLinks;

      expect(permissions1).to.deep.include({
        canReserveLots: true,
        canModifyPromotion: true,
        displayCustomerNames: {
          forLotStatus: ['SOLD', 'RESERVED'],
          invitedBy: 'USER',
        },
      });
      expect(permissions2).to.deep.include({
        canReserveLots: false,
        canModifyPromotion: true,
        displayCustomerNames: {
          forLotStatus: ['SOLD'],
          invitedBy: 'USER',
        },
      });
      expect(permissions3).to.deep.include({
        canReserveLots: true,
        canModifyPromotion: true,
        displayCustomerNames: false,
      });
    });
  });

  describe('down', () => {
    it('sets all RESERVED promotionLots to BOOKED', async () => {
      await PromotionLotService.rawCollection.insert({
        _id: 'a',
        status: 'RESERVED',
      });
      await PromotionLotService.rawCollection.insert({
        _id: 'b',
        status: 'SOLD',
      });
      await PromotionLotService.rawCollection.insert({
        _id: 'c',
        status: 'AVAILABLE',
      });

      await down();

      const [pL1, pL2, pL3] = PromotionLotService.find().fetch();

      expect(pL1.status).to.equal('BOOKED');
      expect(pL2.status).to.equal('SOLD');
      expect(pL3.status).to.equal('AVAILABLE');
    });

    it('migrates back promotion permissions', async () => {
      await UserService.rawCollection.insert({ _id: 'a' });
      await UserService.rawCollection.insert({ _id: 'b' });
      await UserService.rawCollection.insert({ _id: 'c' });
      await PromotionService.rawCollection.insert({
        _id: 'a',
        userLinks: [
          {
            _id: 'a',
            permissions: {
              canReserveLots: true,
              displayCustomerNames: {
                forLotStatus: ['RESERVED', 'SOLD'],
                invitedBy: 'USER',
              },
              canModifyPromotion: true,
            },
          },
          {
            _id: 'b',
            permissions: {
              canReserveLots: false,
              displayCustomerNames: {
                forLotStatus: ['SOLD'],
                invitedBy: 'USER',
              },
              canModifyPromotion: true,
            },
          },
          {
            _id: 'c',
            permissions: {
              canReserveLots: true,
              displayCustomerNames: false,
              canModifyPromotion: true,
            },
          },
        ],
      });

      await down();

      const { userLinks = [] } = PromotionService.findOne({ _id: 'a' });
      const [
        { permissions: permissions1 },
        { permissions: permissions2 },
        { permissions: permissions3 },
      ] = userLinks;

      expect(permissions1).to.deep.include({
        canBookLots: true,
        canModifyPromotion: true,
        displayCustomerNames: {
          forLotStatus: ['SOLD', 'BOOKED'],
          invitedBy: 'USER',
        },
      });
      expect(permissions2).to.deep.include({
        canBookLots: false,
        canModifyPromotion: true,
        displayCustomerNames: {
          forLotStatus: ['SOLD'],
          invitedBy: 'USER',
        },
      });
      expect(permissions3).to.deep.include({
        canBookLots: true,
        canModifyPromotion: true,
        displayCustomerNames: false,
      });
    });
  });
});
