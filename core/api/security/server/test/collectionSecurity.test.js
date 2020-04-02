import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import generator from '../../../factories/server';
import S3Service from '../../../files/server/S3Service';
import { clearBucket } from '../../../files/server/test/S3Service.test';
import { LOAN_STATUS } from '../../../loans/loanConstants';
import LoanService from '../../../loans/server/LoanService';
import { PROMOTION_PERMISSIONS } from '../../../promotions/promotionConstants';
import PromotionService from '../../../promotions/server/PromotionService';
import { PROPERTY_CATEGORY } from '../../../properties/propertyConstants';
import { ROLES } from '../../../users/userConstants';
import { Borrowers, Loans, Promotions, Properties } from '../../..';
import SecurityService, { SECURITY_ERROR } from '../..';

const uploadFile = (key, metadata = {}) => {
  const json = { hello: 'world' };
  const binaryData = Buffer.from(JSON.stringify(json), 'utf-8');
  return S3Service.putObject(binaryData, key, metadata);
};

describe('Collection Security', () => {
  describe('UserSecurity', () => {
    beforeEach(() => {
      resetDatabase();
    });

    describe('isAllowedToInsertByRole', () => {
      const userRole = ROLES.USER;
      const adminRole = ROLES.ADMIN;
      const devRole = ROLES.DEV;
      const otherRole = 'OTHER';
      let admin;

      beforeEach(() => {
        admin = Factory.create('admin');
        sinon.stub(Meteor, 'userId').callsFake(() => admin._id);
      });

      afterEach(() => {
        if (Meteor.userId.restore) {
          Meteor.userId.restore();
        }
      });

      it('throws if no argument is provided', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole(),
        ).to.throw();
      });

      it('throws if no role is provided', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({}),
        ).to.throw(SECURITY_ERROR);
      });

      it('throws if passed another role than the ones defined', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({ role: otherRole }),
        ).to.throw(SECURITY_ERROR);
      });

      it('throws if you try to add devs without dev privileges', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({ role: devRole }),
        ).to.throw(SECURITY_ERROR);
      });

      it('throws if you try to add admins without dev privileges', () => {
        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({ role: adminRole }),
        ).to.throw(SECURITY_ERROR);
      });

      it('throws if you try to add users with user privileges', () => {
        const user = Factory.create('user')._id;
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => user._id);

        expect(() =>
          SecurityService.users.isAllowedToInsertByRole({ role: userRole }),
        ).to.throw(SECURITY_ERROR);
      });
    });
  });

  describe('LoanSecurity', () => {
    let userId;
    let userId2;
    let adminId;
    let devId;
    let loanId;

    beforeEach(() => {
      resetDatabase();
      userId = Factory.create('user')._id;
      userId2 = Factory.create('user')._id;
      adminId = Factory.create('admin')._id;
      devId = Factory.create('dev')._id;
      loanId = Factory.create('loan', { userId })._id;
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      Meteor.userId.restore();
    });

    describe('isAllowedToInsert', () => {
      it('should throw if the user is not logged in', () => {
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => undefined);

        expect(() => SecurityService.loans.isAllowedToInsert()).to.throw(
          SECURITY_ERROR,
        );
      });

      it('should not do anything if the user is logged in', () => {
        SecurityService.loans.isAllowedToInsert();
      });
    });

    describe('isAllowedToUpdate', () => {
      it('should not do anything if the user is the owner', () => {
        expect(() =>
          SecurityService.loans.isAllowedToUpdate(loanId),
        ).to.not.throw();
      });

      it('should not do anything if the user is an admin', () => {
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => adminId);

        expect(() =>
          SecurityService.loans.isAllowedToUpdate(loanId),
        ).to.not.throw();
      });

      it('should not do anything if the user is a dev', () => {
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => devId);

        expect(() =>
          SecurityService.loans.isAllowedToUpdate(loanId),
        ).to.not.throw();
      });

      it('should throw if the user is not the owner', () => {
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => userId2);

        expect(userId).to.not.equal(userId2);
        expect(() => SecurityService.loans.isAllowedToUpdate(loanId)).to.throw(
          SECURITY_ERROR,
        );
      });

      it('should not do anything for anonymous loans', () => {
        generator({ loans: { _id: 'loanId', anonymous: true } });

        expect(() =>
          SecurityService.loans.isAllowedToUpdate('loanId'),
        ).to.not.throw();
      });

      it('should not do anything for non anonymous loans without userIds', () => {
        generator({ loans: { _id: 'loanId' } });

        expect(() =>
          SecurityService.loans.isAllowedToUpdate('loanId'),
        ).to.throw(SECURITY_ERROR);
      });

      it('should throw for expired anonymous loans', () => {
        generator({
          loans: {
            _id: 'loanId',
            anonymous: true,
            status: LOAN_STATUS.UNSUCCESSFUL,
          },
        });

        expect(() =>
          SecurityService.loans.isAllowedToUpdate('loanId'),
        ).to.throw(SECURITY_ERROR);
      });

      it('should throw for accidental anonymous loans', () => {
        generator({
          loans: { _id: 'loanId', anonymous: true, userId: 'someId' },
        });

        expect(() =>
          SecurityService.loans.isAllowedToUpdate('loanId'),
        ).to.throw(SECURITY_ERROR);
      });
    });
  });

  describe('BorrowerSecurity', () => {
    beforeEach(() => {
      resetDatabase();
      sinon.stub(Meteor, 'userId').callsFake(() => undefined);
    });

    afterEach(() => {
      Meteor.userId.restore();
    });

    describe('isAllowedToUpdate', () => {
      it('should not do anything if the user is the owner', () => {
        generator({
          borrowers: { _id: 'borrowerId', user: { _id: 'userId' } },
        });

        expect(() =>
          SecurityService.borrowers.isAllowedToUpdate('borrowerId', 'userId'),
        ).to.not.throw();
      });

      it('should not do anything if the user is an admin', () => {
        generator({
          borrowers: { _id: 'borrowerId' },
          users: { _id: 'adminId', _factory: 'admin' },
        });
        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => 'adminId');

        expect(() =>
          SecurityService.borrowers.isAllowedToUpdate('borrowerId', 'userId'),
        ).to.not.throw();
      });

      it('should not do anything if the borrower is on one anonymous loan', () => {
        generator({
          borrowers: { _id: 'borrowerId', loans: { anonymous: true } },
        });

        expect(() =>
          SecurityService.borrowers.isAllowedToUpdate('borrowerId', 'userId'),
        ).to.not.throw();
      });

      it('should throw if the borrower is on multiple loans', () => {
        generator({
          borrowers: { _id: 'borrowerId', loans: [{ anonymous: true }, {}] },
        });

        expect(() =>
          SecurityService.borrowers.isAllowedToUpdate('borrowerId', 'userId'),
        ).to.throw(SECURITY_ERROR);
      });
    });
  });

  describe('PromotionSecurity', () => {
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

    describe('isAllowedToModify', () => {
      it('throws if the user is not linked to this promotion', () => {
        userId = Factory.create('pro')._id;
        const promotionId = Factory.create('promotion')._id;

        expect(() =>
          SecurityService.promotions.isAllowedToModify({ promotionId, userId }),
        ).to.throw(SECURITY_ERROR);
      });

      it('throws if the user is a PRO without permissions', () => {
        userId = Factory.create('user')._id;
        const promotionId = Factory.create('promotion')._id;
        PromotionService.addProUser({ promotionId, userId });
        PromotionService.setUserPermissions({
          promotionId,
          userId,
          permissions: { canModifyPromotion: false },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToModify({ promotionId, userId }),
        ).to.throw(SECURITY_ERROR);
      });

      it('does not throw if the user is a PRO with MODIFY on it', () => {
        userId = Factory.create('pro')._id;
        const promotionId = Factory.create('promotion')._id;
        PromotionService.addProUser({ promotionId, userId });
        PromotionService.setUserPermissions({
          promotionId,
          userId,
          permissions: { canModifyPromotion: true },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToModify({ promotionId, userId }),
        ).to.not.throw();
      });
    });

    describe('hasAccessToPromotion', () => {
      it('throws if the user has no loan linked to this promotion', () => {
        userId = Factory.create('user')._id;
        const promotionId = Factory.create('promotion')._id;

        expect(() =>
          SecurityService.promotions.hasAccessToPromotion({
            promotionId,
            userId,
          }),
        ).to.throw(SECURITY_ERROR);
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
          SecurityService.promotions.hasAccessToPromotion({
            promotionId,
            userId,
          }),
        ).to.not.throw();
      });

      it('does not throw if the user is a PRO with right permissions', () => {
        userId = Factory.create('pro')._id;
        const promotionId = Factory.create('promotion')._id;
        PromotionService.addProUser({ promotionId, userId });
        PromotionService.setUserPermissions({
          promotionId,
          userId,
          permissions: {},
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotion({
            promotionId,
            userId,
          }),
        ).to.not.throw();
      });

      it('does not throw if user is an admin', () => {
        userId = Factory.create('admin')._id;
        const promotionId = Factory.create('promotion')._id;

        expect(() =>
          SecurityService.promotions.hasAccessToPromotion({
            promotionId,
            userId,
          }),
        ).to.not.throw();
      });
    });

    describe('hasAccessToPromotionLot', () => {
      it('throws if the user is not on this promotion', () => {
        generator({
          users: { _id: 'userId', loans: { _id: 'loanId' } },
          properties: { _id: 'propId' },
          promotions: [
            {
              promotionLots: {
                _id: 'pLotId',
                propertyLinks: [{ _id: 'propId' }],
              },
            },
            { loans: { _id: 'loanId' } },
          ],
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotionLot({
            promotionLotId: 'pLotId',
            userId: 'userId',
          }),
        ).to.throw(SECURITY_ERROR);
      });

      it('does not throw if the user is on the promotion', () => {
        generator({
          users: { _id: 'userId', loans: { _id: 'loanId' } },
          properties: { _id: 'propId' },
          promotions: {
            promotionLots: {
              _id: 'pLotId',
              propertyLinks: [{ _id: 'propId' }],
            },
            loans: { _id: 'loanId' },
          },
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotionLot({
            promotionLotId: 'pLotId',
            userId: 'userId',
          }),
        ).to.not.throw(SECURITY_ERROR);
      });
    });

    describe('hasAccessToPromotionOption', () => {
      it('throws if the option is not on the users loan', () => {
        userId = Factory.create('user')._id;
        const loanId = Factory.create('loan', { userId })._id;
        const promotionId = Factory.create('promotion')._id;
        const promotionOptionId = Factory.create('promotionOption')._id;

        PromotionService.addLink({
          id: promotionId,
          linkName: 'loans',
          linkId: loanId,
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotionOption({
            promotionOptionId,
            userId,
          }),
        ).to.throw(SECURITY_ERROR);
      });

      it('does not throw if the option is on the users loan', () => {
        userId = Factory.create('user')._id;
        const loanId = Factory.create('loan', { userId })._id;
        const promotionId = Factory.create('promotion')._id;
        const promotionOptionId = Factory.create('promotionOption')._id;

        PromotionService.addLink({
          id: promotionId,
          linkName: 'loans',
          linkId: loanId,
        });
        LoanService.addLink({
          id: loanId,
          linkName: 'promotionOptions',
          linkId: promotionOptionId,
        });

        expect(() =>
          SecurityService.promotions.hasAccessToPromotionOption({
            promotionOptionId,
            userId,
          }),
        ).to.not.throw(SECURITY_ERROR);
      });
    });

    describe('isAllowedToSeePromotionCustomer', () => {
      it('does not throw if the user is admin', () => {
        generator({
          users: { _factory: 'admin', _id: 'adminId' },
          promotions: { _id: 'promotionId', loans: { _id: 'loanId' } },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToSeePromotionCustomer({
            promotionId: 'promotionId',
            userId: 'adminId',
            loanId: 'loanId',
          }),
        ).to.not.throw();
      });

      it('throws if the pro is not on this promotion', () => {
        generator({
          users: { _factory: 'pro', _id: 'proId' },
          promotions: { _id: 'promotionId', loans: { _id: 'loanId' } },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToSeePromotionCustomer({
            promotionId: 'promotionId',
            userId: 'proId',
            loanId: 'loanId',
          }),
        ).to.throw(SECURITY_ERROR);
      });

      it('throws if the pro is not allowed to see customers', () => {
        generator({
          promotions: {
            _id: 'promotionId',
            loans: { _id: 'loanId' },
            users: {
              _factory: 'pro',
              _id: 'proId',
              $metadata: { permissions: { canSeeCustomerNames: false } },
            },
          },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToSeePromotionCustomer({
            promotionId: 'promotionId',
            userId: 'proId',
            loanId: 'loanId',
          }),
        ).to.throw(SECURITY_ERROR);
      });

      it('does not throw if the pro is allowed to see customers', () => {
        generator({
          promotions: {
            _id: 'promotionId',
            loans: {
              _id: 'loanId',
              $metadata: { invitedBy: 'proId' },
              user: {},
            },
            users: {
              _factory: 'pro',
              _id: 'proId',
              $metadata: {
                permissions: {
                  displayCustomerNames: {
                    invitedBy: 'ANY',
                    forLotStatus: Object.values(
                      PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES
                        .FOR_LOT_STATUS,
                    ),
                  },
                },
              },
            },
          },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToSeePromotionCustomer({
            promotionId: 'promotionId',
            userId: 'proId',
            loanId: 'loanId',
          }),
        ).to.not.throw(SECURITY_ERROR);
      });

      it('does not throw if the pro is allowed to see customers 2', () => {
        generator({
          properties: { _id: 'prop' },
          promotions: {
            _id: 'promotionId',
            loans: [
              {
                _id: 'loanId',
                $metadata: { invitedBy: 'proId' },
                user: {},
                promotionOptions: {
                  promotionLots: {
                    _id: 'reservedPromotionLot',
                    status: 'RESERVED',
                    propertyLinks: [{ _id: 'prop' }],
                    attributedTo: { _id: 'loanId' },
                  },
                },
              },
              {
                _id: 'loanId2',
                $metadata: { invitedBy: 'proId' },
                user: {},
                promotionOptions: {
                  promotionLots: {
                    _id: 'soldPromotionLot',
                    status: 'SOLD',
                    propertyLinks: [{ _id: 'prop' }],
                    attributedTo: { _id: 'loanId2' },
                  },
                },
              },
            ],
            users: {
              _factory: 'pro',
              _id: 'proId',
              $metadata: {
                permissions: {
                  displayCustomerNames: {
                    invitedBy: 'ANY',
                    forLotStatus: ['SOLD'],
                  },
                },
              },
            },
          },
        });

        expect(() =>
          SecurityService.promotions.isAllowedToSeePromotionCustomer({
            promotionId: 'promotionId',
            userId: 'proId',
            loanId: 'loanId',
          }),
        ).to.throw(SECURITY_ERROR);

        expect(() =>
          SecurityService.promotions.isAllowedToSeePromotionCustomer({
            promotionId: 'promotionId',
            userId: 'proId',
            loanId: 'loanId2',
          }),
        ).to.not.throw(SECURITY_ERROR);
      });
    });
  });

  describe('PropertySecurity', () => {
    beforeEach(() => {
      resetDatabase();
    });

    describe('isAllowedToUpdate', () => {
      it('does not throw if user is admin', () => {
        generator({
          users: [{ _id: 'adminId', _factory: 'admin' }],
          properties: [{ _id: 'propertyId' }],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'adminId'),
        ).to.not.throw();
      });

      it('does throw if user is pro and is not allowed to update', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: [{ _id: 'propertyId' }],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId'),
        ).to.throw('Vous ne pouvez pas modifier ce bien immobilier');
      });

      it('does throw if user is user and is not allowed to update', () => {
        generator({
          users: [{ _id: 'userId' }],
          properties: [{ _id: 'propertyId' }],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'userId'),
        ).to.throw('Checking ownership [NOT_AUTHORIZED]');
      });

      it('does not throw if user is user and is allowed to update', () => {
        generator({
          users: [{ _id: 'userId' }],
          properties: [{ _id: 'propertyId', userId: 'userId' }],
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'userId'),
        ).to.not.throw();
      });

      it('does not throw if user is pro and is allowed to update PRO property', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PRO,
            users: {
              _id: 'proId',
              $metadata: { permissions: { canModifyProperty: true } },
            },
          },
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId'),
        ).to.not.throw();
      });

      it('does throw if user is pro and is not allowed to update PRO property', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PRO,
            users: {
              _id: 'proId',
              $metadata: { permissions: { canModifyProperty: false } },
            },
          },
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId'),
        ).to.throw('Vous ne pouvez pas modifier ce bien immobilier');
      });

      it('does throw if user is pro and is not allowed to update PROMOTION property', () => {
        generator({
          users: [{ _id: 'proId', _factory: 'pro' }],
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PROMOTION,
          },

          promotions: {
            _id: 'promotionId',
            users: {
              _id: 'proId',
              $metadata: { permissions: { canModifyPromotion: false } },
            },

            propertyLinks: [{ _id: 'propertyId' }],
          },
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId'),
        ).to.throw('Vous ne pouvez pas modifier cette promotion');
      });

      it('does not throw if user is pro and is allowed to update PROMOTION property', () => {
        generator({
          users: { _id: 'proId', _factory: 'pro' },
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PROMOTION,
          },

          promotions: {
            _id: 'promotionId',
            users: {
              _id: 'proId',
              $metadata: { permissions: { canModifyPromotion: true } },
            },
            propertyLinks: [{ _id: 'propertyId' }],
          },
        });

        expect(() =>
          SecurityService.properties.isAllowedToUpdate('propertyId', 'proId'),
        ).to.not.throw();
      });
    });
  });

  describe('FileSecurity', function() {
    this.timeout(10000);

    describe('isAllowedToAccess ', () => {
      let userId;
      let user;

      before(function() {
        if (Meteor.settings.public.microservice !== 'pro') {
          // When running these tests in parallel, it breaks tests
          this.parent.pending = true;
          this.skip();
        }
      });

      beforeEach(async () => {
        resetDatabase();
        await clearBucket();
        user = Factory.create('user');
        userId = user._id;
        sinon.stub(Meteor, 'user').callsFake(() => user);
        sinon.stub(Meteor, 'userId').callsFake(() => userId);
      });

      afterEach(() => {
        Meteor.user.restore();
        Meteor.userId.restore();
      });

      it('should return true if the user is dev', async () => {
        Meteor.users.update(userId, { $set: { roles: ['dev'] } });
        await uploadFile('test/hello.json');
        const isAllowed = await SecurityService.files.isAllowedToAccess({
          key: 'test/hello.json',
          userId,
        });

        expect(isAllowed).to.equal(true);
      });

      it('should return true if the user is admin', async () => {
        Meteor.users.update(userId, { $set: { roles: 'admin' } });
        await uploadFile('test/hello.json');
        const isAllowed = await SecurityService.files.isAllowedToAccess({
          key: 'test/hello.json',
          userId,
        });

        expect(isAllowed).to.equal(true);
      });

      it('should throw if file is admin only and user is user', async () => {
        await uploadFile('test/hello.json', { roles: 'admin' });
        try {
          await SecurityService.files.isAllowedToAccess({
            key: 'test/hello.json',
            userId,
          });
          expect(1).to.equal(0, 'Should throw');
        } catch (error) {
          expect(error.message).to.include('Unauthorized download');
        }
      });

      it('should throw if file is admin only and user is pro', async () => {
        Meteor.users.update(userId, { $set: { roles: 'pro' } });
        await uploadFile('test/hello.json', { roles: 'admin' });
        try {
          await SecurityService.files.isAllowedToAccess({
            key: 'test/hello.json',
            userId,
          });
          expect(1).to.equal(0, 'Should throw');
        } catch (error) {
          expect(error.message).to.include('Unauthorized download');
        }
      });

      it('should throw if no loan or borrower is associated to this account', async () => {
        await uploadFile('test/hello.json');
        try {
          await SecurityService.files.isAllowedToAccess({
            key: 'test/hello.json',
            userId,
          });
          expect(1).to.equal(0, 'Should throw');
        } catch (error) {
          expect(error.message).to.include('Unauthorized download');
        }
      });

      it('should return true if this user has the loan', async () => {
        const loan = Factory.create('loan', { userId });
        const key = `${loan._id}/hello.json`;

        await uploadFile(key);
        const isAllowed = await SecurityService.files.isAllowedToAccess({
          key,
          userId,
        });

        expect(isAllowed).to.equal(true);
        Loans.remove(loan._id);
      });

      it('should return true if this user has the borrower', async () => {
        const borrower = Factory.create('borrower', { userId });
        const key = `${borrower._id}/hello.json`;

        await uploadFile(key);
        const isAllowed = await SecurityService.files.isAllowedToAccess({
          key,
          userId,
        });

        expect(isAllowed).to.equal(true);
        Borrowers.remove(borrower._id);
      });

      it('should return true if this user has the property', async () => {
        const property = Factory.create('property', { userId });
        const key = `${property._id}/hello.json`;

        await uploadFile(key);
        const isAllowed = await SecurityService.files.isAllowedToAccess({
          key,
          userId,
        });

        expect(isAllowed).to.equal(true);
        Properties.remove(property._id);
      });

      describe('with a pro property', () => {
        let property;
        let key;

        beforeEach(() => {
          property = Factory.create('property', {
            category: PROPERTY_CATEGORY.PRO,
          });
          key = `${property._id}/hello.json`;
        });

        afterEach(() => Properties.remove(property._id));

        it('should return true when the file is public', async () => {
          await uploadFile(key);
          const isAllowed = await SecurityService.files.isAllowedToAccess({
            key,
            userId,
          });

          expect(isAllowed).to.equal(true);
        });

        it('should return true when the file is pro only with a pro user', async () => {
          Meteor.users.update(userId, { $set: { roles: 'pro' } });

          await uploadFile(key, { roles: 'pro' });
          const isAllowed = await SecurityService.files.isAllowedToAccess({
            key,
            userId,
          });

          expect(isAllowed).to.equal(true);
        });

        it('should throw when the file is pro only with a user', async () => {
          await uploadFile(key, { roles: 'pro' });

          try {
            await SecurityService.files.isAllowedToAccess({ key, userId });
            expect(1).to.equal(0, 'Should throw');
          } catch (error) {
            expect(error.message).to.include('Unauthorized download');
          }
        });
      });

      describe('with a promotion', () => {
        let promotion;
        let key;

        beforeEach(() => {
          promotion = Factory.create('promotion');
          key = `${promotion._id}/hello.json`;
        });

        afterEach(() => Promotions.remove(promotion._id));

        it('should return true when the file is public', async () => {
          await uploadFile(key);
          const isAllowed = await SecurityService.files.isAllowedToAccess({
            key,
            userId,
          });

          expect(isAllowed).to.equal(true);
        });

        it('should return true when the file is pro only with a pro user', async () => {
          Meteor.users.update(userId, { $set: { roles: 'pro' } });

          await uploadFile(key, { roles: 'pro' });
          const isAllowed = await SecurityService.files.isAllowedToAccess({
            key,
            userId,
          });

          expect(isAllowed).to.equal(true);
        });

        it('should throw when the file is pro only with a user', async () => {
          await uploadFile(key, { roles: 'pro' });

          try {
            await SecurityService.files.isAllowedToAccess({ key, userId });
            expect(1).to.equal(0, 'Should throw');
          } catch (error) {
            expect(error.message).to.include('Unauthorized download');
          }
        });
      });
    });
  });
});
