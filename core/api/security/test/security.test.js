/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import { stubCollections } from 'core/utils/testHelpers';

import SecurityService, { SECURITY_ERROR } from '..';

describe('Security tests', () => {
    let devId;
    let loanId;

    beforeEach(() => {
        resetDatabase();
        stubCollections();
        devId = Factory.create('dev')._id;
        sinon.stub(Meteor, 'userId').callsFake(() => devId);
    });

    afterEach(() => {
        stubCollections.restore();
        Meteor.userId.restore();
    });

    describe('hasRole', () => {
        it('checks a role without throwing', () => {
            expect(() =>
                SecurityService.security.checkRole(devId, 'dev')
            ).to.not.throw();
        });

        it('throws if false', () => {
            expect(() =>
                SecurityService.security.checkRole(devId, 'test')
            ).to.throw(SECURITY_ERROR);
        });
    });

    describe('LoanSecurity', () => {
        beforeEach(() => {
            loanId = Factory.create('loan', { devId })._id;
        });

        describe('isAllowedToUpdate', () => {
            it('returns undefined if the user is a dev', () => {
                expect(
                    SecurityService.loans.isAllowedToUpdate(loanId)
                ).to.equal(undefined);
            });

            it('returns undefined if the user does not own the loan', () => {
                const userId = Factory.create('user')._id;
                Meteor.userId.restore();
                sinon.stub(Meteor, 'userId').callsFake(() => userId);

                expect(() =>
                    SecurityService.loans.isAllowedToUpdate(loanId)
                ).to.throw(SECURITY_ERROR);
            });
        });
    });
});
