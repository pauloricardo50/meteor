/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import moment from 'moment';
import { stubCollections } from  'core/utils/testHelpers';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import LoanRequests from '../loanrequests';

import {
  insertRequest,
  updateRequest,
  startAuction,
  getAuctionEndTime,
  pushRequestValue,
  popRequestValue,
  incrementStep,
  requestVerification,
  deleteRequest,
  addEmail,
  modifyEmail,
} from '../methods';

describe('loanRequests', () => {
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
    describe('insertRequest', () => {
      it('Properly inserts a minimal request', () => {
        const object = {
          general: { fortuneUsed: 10 },
          property: { value: 100 },
          borrowers: ['asd'],
        };

        return insertRequest.callPromise({ object, userId }).then((requestId) => {
          const request = LoanRequests.findOne(requestId);

          expect(typeof request).to.equal('object');
          expect(request.userId).to.equal(userId);
        });
      });
    });

    describe('modifiers', () => {
      let request;

      beforeEach(() => {
        request = Factory.create('loanRequest', { userId });
      });

      describe('updateRequest', () => {
        it('Properly update a request', () => {
          const id = request._id;
          const object = { 'general.fortuneUsed': 300000 };

          return updateRequest.callPromise({ object, id }).then(() => {
            const modifiedRequest = LoanRequests.findOne(id);
            expect(modifiedRequest.general.fortuneUsed).to.equal(300000);
          });
        });
      });

      describe('pushRequestValue', () => {
        it('Properly pushes a value to request', () => {
          console.log('pushRequestValue test starting..');
          const id = request._id;
          const object = { 'general.partnersToAvoid': 'Jack' };
          console.log('obj: ', { object, id });
          return pushRequestValue
            .callPromise({ object, id })
            .then((result) => {
              console.log('callPromise result: ', result);
              const modifiedRequest = LoanRequests.findOne(id);
              const length = request.general.partnersToAvoid.length;

              console.log('modifiedRequest: ', modifiedRequest);

              expect(modifiedRequest.general.partnersToAvoid.length).to.equal(length + 1);
            })
            .catch((error) => {
              console.log('promise error: ', error);
              throw error;
            });
        });
      });

      describe('popRequestValue', () => {
        it('Properly pops a value from a request', () => {
          const id = request._id;
          const object = { 'general.partnersToAvoid': 1 };
          popRequestValue.callPromise({ object, id }).then(() => {
            const modifiedRequest = LoanRequests.findOne(id);
            const length = request.general.partnersToAvoid.length;

            expect(modifiedRequest.general.partnersToAvoid.length).to.equal(length - 1);
          });
        });
      });

      describe('startAuction', () => {
        if (Meteor.isServer) {
          it('Should work', () => {
            const id = request._id;

            expect(!!request.logic.auction.status).to.equal(false);
            expect(request.logic.auction.startTime).to.equal(undefined);

            return startAuction.callPromise({ id, object: {} }).then(() => {
              const modifiedRequest = LoanRequests.findOne(id);

              expect(modifiedRequest.logic.auction.status).to.equal('started');
              expect(modifiedRequest.logic.auction.startTime instanceof Date).to
                .be.true;
            });
          });
        }
      });

      describe('incrementStep', () => {
        it('Should work');
      });

      // FIXME: This test generates all sorts of fucked up errors..
      // describe('requestVerification', () => {
      //   it('Should set requested to true and add a time', (done) => {
      //     const id = request._id;
      //     requestVerification.call({ id }, () => {
      //       const modifiedRequest = LoanRequests.findOne(id));
      //
      //       expect(modifiedRequest.logic.verification.requested).to.equal(true);
      //       expect(modifiedRequest.logic.verification.requestedTime).to.exist;
      //       done();
      //     });
      //   });
      // });

      describe('deleteRequest', () => {
        if (Meteor.isClient) {
          it('Should work if user is a developer', () => {
            const devUserId = Factory.create('dev');
            const id = Factory.create('loanRequest', { userId: devUserId })._id;

            deleteRequest._execute({ id });

            const modifiedRequest = LoanRequests.findOne(id);

            expect(modifiedRequest).to.not.exist;
          });
        }

        it("Should throw an error if user isn't a developer", () => {
          const id = request._id;

          expect(() => {
            // Wrap it in a function to be able to test if it throws
            deleteRequest.call({ id });
          }).to.throw(Error);
        });
      });

      describe('addEmail', () => {
        it('adds an email', () => {
          const id = request._id;
          const email = {
            requestId: id,
            emailId: 'test',
            _id: 'testId',
            status: 'sent',
          };

          expect(request.emails.length).to.equal(0);

          return addEmail.callPromise(email, () => {
            const modifiedRequest = LoanRequests.findOne(id);

            expect(modifiedRequest.emails.length).to.equal(1);
            expect(modifiedRequest.emails[0].emailId).to.equal(email.emailId);
            expect(modifiedRequest.emails[0]._id).to.equal(email._id);
            expect(modifiedRequest.emails[0].status).to.equal(email.status);
            expect(modifiedRequest.emails[0].updatedAt instanceof Date).to.be
              .true;
            expect(Object.keys(modifiedRequest.emails[0]).length).to.equal(4);
          });
        });

        it('adds a scheduled email', () => {
          const id = request._id;
          const date = new Date();
          const email = {
            requestId: id,
            emailId: 'test',
            _id: 'testId',
            status: 'sent',
            sendAt: date,
          };

          return addEmail.callPromise(email, () => {
            const modifiedRequest = LoanRequests.findOne(id);

            expect(modifiedRequest.emails[0].scheduledAt.getTime()).to.equal(date.getTime());
            expect(Object.keys(modifiedRequest.emails[0]).length).to.equal(5);
          });
        });
      });

      describe('modifyEmail', () => {
        it('modifies an email', () => {
          const id = request._id;
          const email = {
            requestId: id,
            emailId: 'test',
            _id: 'testId',
            status: 'sent',
          };
          const modification = {
            requestId: id,
            _id: 'testId',
            status: 'modified',
          };

          expect(request.emails.length).to.equal(0);

          // Add multiple emails to make test more realistic
          return addEmail
            .callPromise(email)
            .then(() => addEmail.callPromise({ ...email, _id: 'testId2' }))
            .then(() => modifyEmail.callPromise(modification))
            .then(() => {
              const modifiedRequest = LoanRequests.findOne(id);

              expect(Object.keys(modifiedRequest.emails[0]).length).to.equal(4);
              expect(modifiedRequest.emails[0].status).to.equal(modification.status);
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
