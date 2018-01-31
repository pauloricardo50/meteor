/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import moment from 'moment';
import { stubCollections } from 'core/utils/testHelpers';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { AUCTION_STATUS } from '../../constants';
import Loans from '../loans';

import {
  insertLoan,
  updateLoan,
  startAuction,
  getAuctionEndTime,
  pushLoanValue,
  popLoanValue,
  incrementStep,
  loanVerification,
  deleteLoan,
  addEmail,
  modifyEmail,
} from '../methods';

describe('loans', () => {
  let userId;

  beforeEach(() => {
    resetDatabase();
    stubCollections();
    userId = Factory.create('user')._id;
    sinon.stub(Meteor, 'userId').callsFake(() => userId);
  });

  afterEach(() => {
    stubCollections.restore();

    Meteor.userId.restore();
  });

  describe('methods', () => {
    describe('insertLoan', () => {
      it('Properly inserts a minimal loan', () => {
        const object = {
          general: { fortuneUsed: 10 },
          property: { value: 100 },
          borrowers: ['asd'],
        };

        return insertLoan.callPromise({ object, userId }).then((loanId) => {
          const loan = Loans.findOne(loanId);

          expect(typeof loan).to.equal('object');
          expect(loan.userId).to.equal(userId);
        });
      });
    });

    describe('modifiers', () => {
      let loan;

      beforeEach(() => {
        loan = Factory.create('loan', { userId });
      });

      describe('updateLoan', () => {
        it('Properly update a loan', () => {
          const id = loan._id;
          const object = { 'general.fortuneUsed': 300000 };

          return updateLoan.callPromise({ object, id }).then(() => {
            const modifiedLoan = Loans.findOne(id);
            expect(modifiedLoan.general.fortuneUsed).to.equal(300000);
          });
        });
      });

      describe('pushLoanValue', () => {
        it('Properly pushes a value to loan', () => {
          console.log('pushLoanValue test starting..');
          const id = loan._id;
          const object = { 'general.partnersToAvoid': 'Jack' };
          console.log('obj: ', { object, id });
          return pushLoanValue
            .callPromise({ object, id })
            .then((result) => {
              console.log('callPromise result: ', result);
              const modifiedLoan = Loans.findOne(id);
              const length = loan.general.partnersToAvoid.length;

              console.log('modifiedLoan: ', modifiedLoan);

              expect(modifiedLoan.general.partnersToAvoid.length).to.equal(length + 1);
            })
            .catch((error) => {
              console.log('promise error: ', error);
              throw error;
            });
        });
      });

      describe('popLoanValue', () => {
        it('Properly pops a value from a loan', () => {
          const id = loan._id;
          const object = { 'general.partnersToAvoid': 1 };
          popLoanValue.callPromise({ object, id }).then(() => {
            const modifiedLoan = Loans.findOne(id);
            const length = loan.general.partnersToAvoid.length;

            expect(modifiedLoan.general.partnersToAvoid.length).to.equal(length - 1);
          });
        });
      });

      describe('startAuction', () => {
        if (Meteor.isServer) {
          it('Should work', () => {
            const id = loan._id;

            expect(!!loan.logic.auction.status).to.equal(false);
            expect(loan.logic.auction.startTime).to.equal(undefined);

            return startAuction.callPromise({ id, object: {} }).then(() => {
              const modifiedLoan = Loans.findOne(id);

              expect(modifiedLoan.logic.auction.status).to.equal(AUCTION_STATUS.STARTED);
              expect(modifiedLoan.logic.auction.startTime instanceof Date).to
                .be.true;
            });
          });
        }
      });

      describe('incrementStep', () => {
        it('Should work');
      });

      // FIXME: This test generates all sorts of fucked up errors..
      // describe('loanVerification', () => {
      //   it('Should set requested to true and add a time', (done) => {
      //     const id = loan._id;
      //     loanVerification.call({ id }, () => {
      //       const modifiedLoan = Loans.findOne(id));
      //
      //       expect(modifiedLoan.logic.verification.requested).to.equal(true);
      //       expect(modifiedLoan.logic.verification.requestedTime).to.exist;
      //       done();
      //     });
      //   });
      // });

      describe('deleteLoan', () => {
        if (Meteor.isClient) {
          it('Should work if user is a developer', () => {
            const devUserId = Factory.create('dev');
            const id = Factory.create('loan', { userId: devUserId })._id;

            deleteLoan._execute({ id });

            const modifiedLoan = Loans.findOne(id);

            expect(modifiedLoan).to.not.exist;
          });
        }

        it("Should throw an error if user isn't a developer", () => {
          const id = loan._id;

          expect(() => {
            // Wrap it in a function to be able to test if it throws
            deleteLoan.call({ id });
          }).to.throw(Error);
        });
      });

      describe('addEmail', () => {
        it('adds an email', () => {
          const id = loan._id;
          const email = {
            loanId: id,
            emailId: 'test',
            _id: 'testId',
            status: 'sent',
          };

          expect(loan.emails.length).to.equal(0);

          return addEmail.callPromise(email, () => {
            const modifiedLoan = Loans.findOne(id);

            expect(modifiedLoan.emails.length).to.equal(1);
            expect(modifiedLoan.emails[0].emailId).to.equal(email.emailId);
            expect(modifiedLoan.emails[0]._id).to.equal(email._id);
            expect(modifiedLoan.emails[0].status).to.equal(email.status);
            expect(modifiedLoan.emails[0].updatedAt instanceof Date).to.be
              .true;
            expect(Object.keys(modifiedLoan.emails[0]).length).to.equal(4);
          });
        });

        it('adds a scheduled email', () => {
          const id = loan._id;
          const date = new Date();
          const email = {
            loanId: id,
            emailId: 'test',
            _id: 'testId',
            status: 'sent',
            sendAt: date,
          };

          return addEmail.callPromise(email, () => {
            const modifiedLoan = Loans.findOne(id);

            expect(modifiedLoan.emails[0].scheduledAt.getTime()).to.equal(date.getTime());
            expect(Object.keys(modifiedLoan.emails[0]).length).to.equal(5);
          });
        });
      });

      describe('modifyEmail', () => {
        it('modifies an email', () => {
          const id = loan._id;
          const email = {
            loanId: id,
            emailId: 'test',
            _id: 'testId',
            status: 'sent',
          };
          const modification = {
            loanId: id,
            _id: 'testId',
            status: 'modified',
          };

          expect(loan.emails.length).to.equal(0);

          // Add multiple emails to make test more realistic
          return addEmail
            .callPromise(email)
            .then(() => addEmail.callPromise({ ...email, _id: 'testId2' }))
            .then(() => modifyEmail.callPromise(modification))
            .then(() => {
              const modifiedLoan = Loans.findOne(id);

              expect(Object.keys(modifiedLoan.emails[0]).length).to.equal(4);
              expect(modifiedLoan.emails[0].status).to.equal(modification.status);
            });
        });
      });
    });
  });

  describe('getAuctionEndTime', () => {
    let endDate;

    beforeEach(() => {
      endDate = moment()
        .year(2017)
        .month(0)
        .hours(23)
        .minutes(59)
        .seconds(59)
        .milliseconds(0);
    });

    it('Should return wednesday night for a monday afternoon', () => {
      // Jan 2nd 2017, a monday
      const date = moment()
        .year(2017)
        .month(0)
        .date(2)
        .hours(14);
      endDate.date(4);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return monday night for a thursday afternoon', () => {
      // Jan 5th 2017, a thursday
      const date = moment()
        .year(2017)
        .month(0)
        .date(5)
        .hours(14);
      endDate.date(9);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a friday afternoon', () => {
      // Jan 6th 2017, a friday
      const date = moment()
        .year(2017)
        .month(0)
        .date(6)
        .hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a monday early morning', () => {
      // Jan 2nd 2017, a monday
      const date = moment()
        .year(2017)
        .month(0)
        .date(2)
        .hours(5);
      endDate.date(3);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a saturday afternoon', () => {
      // Jan 7th 2017, a saturday
      const date = moment()
        .year(2017)
        .month(0)
        .date(7)
        .hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a saturday early morning', () => {
      // Jan 7th 2017, a saturday
      const date = moment()
        .year(2017)
        .month(0)
        .date(7)
        .hours(5);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a sunday afternoon', () => {
      // Jan 8th 2017, a sunday
      const date = moment()
        .year(2017)
        .month(0)
        .date(8)
        .hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a sunday early morning', () => {
      // Jan 8th 2017, a sunday
      const date = moment()
        .year(2017)
        .month(0)
        .date(8)
        .hours(5);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });
  });
});
