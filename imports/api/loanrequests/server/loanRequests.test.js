/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import moment from 'moment';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { stubCollections } from '/imports/js/helpers/testHelpers';

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
  beforeEach(() => {
    resetDatabase();
    stubCollections();
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('methods', () => {
    describe('insertRequest', () => {
      it('Properly inserts a minimal request', () => {
        const object = {
          general: { fortuneUsed: 10 },
          property: { value: 100 },
          borrowers: ['asd'],
        };
        const userId = 'asdf';

        const requestId = insertRequest.call({ object, userId });
        const request = LoanRequests.findOne({ _id: requestId });

        expect(typeof request).to.equal('object');
        expect(request.userId).to.equal(userId);
      });
    });

    describe('modifiers', () => {
      let request;
      beforeEach(() => {
        request = Factory.create('loanRequest');
      });

      describe('updateRequest', () => {
        it('Properly update a request', () => {
          const id = request._id;
          const object = { 'general.fortuneUsed': 300000 };
          updateRequest.call({ object, id });
          const modifiedRequest = LoanRequests.findOne({ _id: id });

          expect(modifiedRequest.general.fortuneUsed).to.equal(300000);
        });
      });

      describe('pushRequestValue', () => {
        it('Properly pushes a value to request', () => {
          const id = request._id;
          const object = { 'general.partnersToAvoid': 'Jack' };
          pushRequestValue.call({ object, id });
          const modifiedRequest = LoanRequests.findOne({ _id: id });
          const length = request.general.partnersToAvoid.length;

          expect(modifiedRequest.general.partnersToAvoid.length).to.equal(
            length + 1,
          );
        });
      });

      describe('popRequestValue', () => {
        it('Properly pops a value from a request', () => {
          const id = request._id;
          const object = { 'general.partnersToAvoid': 1 };
          popRequestValue.call({ object, id });
          const modifiedRequest = LoanRequests.findOne({ _id: id });
          const length = request.general.partnersToAvoid.length;

          expect(modifiedRequest.general.partnersToAvoid.length).to.equal(
            length - 1,
          );
        });
      });

      describe('startAuction', () => {
        if (Meteor.isServer) {
          it('Should work', () => {
            const id = request._id;

            expect(!!request.logic.auctionStarted).to.equal(false);
            expect(request.logic.auctionStartTime).to.equal(undefined);

            startAuction.call({ id, object: {} });
            const modifiedRequest = LoanRequests.findOne({ _id: id });

            expect(modifiedRequest.logic.auctionStarted).to.equal(true);
            expect(modifiedRequest.logic.auctionStartTime instanceof Date).to.be
              .true;

            // Meteor.defer(() => {
            //   expect(modifiedRequest.emails.length).to.equal(2);
            //   done();
            // });
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
      //       const modifiedRequest = LoanRequests.findOne({ _id: id });
      //
      //       expect(modifiedRequest.logic.verification.requested).to.equal(true);
      //       expect(modifiedRequest.logic.verification.requestedTime).to.exist;
      //       done();
      //     });
      //   });
      // });

      describe('deleteRequest', () => {
        if (Meteor.isClient) {
          it('Should work if user is a developer', (done) => {
            const devRequest = Factory.create('loanRequestDev');

            Meteor.userId = () => devRequest.userId;

            const id = devRequest._id;
            deleteRequest.call({ id }, () => {
              const modifiedRequest = LoanRequests.findOne({ _id: id });

              expect(modifiedRequest).to.not.exist;

              // Reset the userId function to its default value
              Meteor.userId = () => Accounts.userId;
              done();
            });
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
        it('adds an email', (done) => {
          const id = request._id;
          const email = {
            requestId: id,
            emailId: 'test',
            _id: 'testId',
            status: 'sent',
          };

          expect(request.emails.length).to.equal(0);

          addEmail.call(email, () => {
            const modifiedRequest = LoanRequests.findOne({ _id: id });

            expect(modifiedRequest.emails.length).to.equal(1);
            expect(modifiedRequest.emails[0].emailId).to.equal(email.emailId);
            expect(modifiedRequest.emails[0]._id).to.equal(email._id);
            expect(modifiedRequest.emails[0].status).to.equal(email.status);
            expect(modifiedRequest.emails[0].updatedAt instanceof Date).to.be
              .true;
            expect(Object.keys(modifiedRequest.emails[0]).length).to.equal(4);
            done();
          });
        });

        it('adds a scheduled email', (done) => {
          const id = request._id;
          const date = new Date();
          const email = {
            requestId: id,
            emailId: 'test',
            _id: 'testId',
            status: 'sent',
            sendAt: date,
          };

          addEmail.call(email, () => {
            const modifiedRequest = LoanRequests.findOne({ _id: id });

            expect(modifiedRequest.emails[0].scheduledAt.getTime()).to.equal(
              date.getTime(),
            );
            expect(Object.keys(modifiedRequest.emails[0]).length).to.equal(5);
            done();
          });
        });
      });

      describe('modifyEmail', () => {
        it('modifies an email', (done) => {
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
          addEmail.call(email, () => {
            addEmail.call({ ...email, _id: 'testId2' }, () => {
              modifyEmail.call(modification, () => {
                const modifiedRequest = LoanRequests.findOne({ _id: id });

                expect(Object.keys(modifiedRequest.emails[0]).length).to.equal(
                  4,
                );
                expect(modifiedRequest.emails[0].status).to.equal(
                  modification.status,
                );
                done();
              });
            });
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
      const date = moment().year(2017).month(0).date(2).hours(14);
      endDate.date(4);

      expect(getAuctionEndTime(date).getTime()).to.equal(
        endDate.toDate().getTime(),
      );
    });

    it('Should return monday night for a thursday afternoon', () => {
      // Jan 5th 2017, a thursday
      const date = moment().year(2017).month(0).date(5).hours(14);
      endDate.date(9);

      expect(getAuctionEndTime(date).getTime()).to.equal(
        endDate.toDate().getTime(),
      );
    });

    it('Should return Tuesday night for a friday afternoon', () => {
      // Jan 6th 2017, a friday
      const date = moment().year(2017).month(0).date(6).hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(
        endDate.toDate().getTime(),
      );
    });

    it('Should return Tuesday night for a monday early morning', () => {
      // Jan 2nd 2017, a monday
      const date = moment().year(2017).month(0).date(2).hours(5);
      endDate.date(3);

      expect(getAuctionEndTime(date).getTime()).to.equal(
        endDate.toDate().getTime(),
      );
    });

    it('Should return Tuesday night for a saturday afternoon', () => {
      // Jan 7th 2017, a saturday
      const date = moment().year(2017).month(0).date(7).hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(
        endDate.toDate().getTime(),
      );
    });

    it('Should return Tuesday night for a saturday early morning', () => {
      // Jan 7th 2017, a saturday
      const date = moment().year(2017).month(0).date(7).hours(5);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(
        endDate.toDate().getTime(),
      );
    });

    it('Should return Tuesday night for a sunday afternoon', () => {
      // Jan 8th 2017, a sunday
      const date = moment().year(2017).month(0).date(8).hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(
        endDate.toDate().getTime(),
      );
    });

    it('Should return Tuesday night for a sunday early morning', () => {
      // Jan 8th 2017, a sunday
      const date = moment().year(2017).month(0).date(8).hours(5);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(
        endDate.toDate().getTime(),
      );
    });
  });
});
