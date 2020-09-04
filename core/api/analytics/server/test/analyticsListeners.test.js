/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import {
  checkEmails,
  resetDatabase,
  waitForStub,
} from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import {
  ACQUISITION_STATUS,
  PURCHASE_TYPE,
} from '../../../loans/loanConstants';
import {
  adminLoanInsert,
  anonymousLoanInsert,
  userLoanInsert,
} from '../../../loans/methodDefinitions';
import LoanService from '../../../loans/server/LoanService';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
} from '../../../properties/propertyConstants';
import { proInviteUser } from '../../../users/methodDefinitions';
import EVENTS from '../../events';
import {
  analyticsOnboardingStep,
  analyticsStartedOnboarding,
} from '../../methodDefinitions';
import { EVENTS_CONFIG } from '../eventsConfig';
import NoOpAnalytics from '../NoOpAnalytics';

describe('analyticsListeners', () => {
  let analyticsSpy;

  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        {
          _factory: 'pro',
          _id: 'pro',
          firstName: 'Pro',
          lastName: 'User',
          organisations: {
            _id: 'proOrg',
            name: 'org',
            $metadata: { isMain: true },
          },
        },
        {
          _factory: 'advisor',
          _id: 'advisor',
          firstName: 'Advisor',
          lastName: 'E-Potek',
        },
        {
          _factory: 'user',
          _id: 'user',
          firstName: 'Tom',
          lastName: 'Sawyer',
          emails: [{ address: 'tom.sawyer@e-potek.ch', verified: true }],
          assignedEmployeeId: 'advisor',
          referredByOrganisationLink: 'proOrg',
          referredByUserLink: 'pro',
        },
      ],
      properties: {
        _id: 'property',
        category: PROPERTY_CATEGORY.PRO,
        userLinks: [{ _id: 'pro', permissions: { canInviteCustomers: true } }],
        zipCode: 1201,
        value: 1000000,
      },
    });

    analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
  });

  afterEach(() => {
    NoOpAnalytics.prototype.track.restore();
  });

  describe('anonymousLoanInsert', () => {
    it('tracks LOAN_CREATED event for organic users', async () => {
      await anonymousLoanInsert.run({});

      const [[{ userId, event, properties }]] = await waitForStub(analyticsSpy);

      expect(userId).to.equal(null);
      expect(event).to.equal(EVENTS_CONFIG[EVENTS.LOAN_CREATED].name);
      expect(properties).to.deep.include({ anonymous: true });
    });

    it('tracks LOAN_CREATED event for referral organic users', async () => {
      await anonymousLoanInsert.run({ referralId: 'pro' });

      const [[{ userId, event, properties }]] = await waitForStub(analyticsSpy);

      expect(userId).to.equal(null);
      expect(event).to.equal(EVENTS_CONFIG[EVENTS.LOAN_CREATED].name);
      expect(properties).to.deep.include({
        anonymous: true,
        referralId: 'pro',
      });
    });

    it('tracks LOAN_CREATED event for referral organic users with a property', async () => {
      await anonymousLoanInsert.run({
        referralId: 'pro',
        proPropertyId: 'property',
      });

      const [[{ userId, event, properties }]] = await waitForStub(analyticsSpy);

      expect(userId).to.equal(null);
      expect(event).to.equal(EVENTS_CONFIG[EVENTS.LOAN_CREATED].name);
      expect(properties).to.deep.include({
        anonymous: true,
        referralId: 'pro',
        propertyId: 'property',
      });
    });
  });

  describe('userLoanInsert', () => {
    const commonProperties = {
      anonymous: false,
      userEmail: 'tom.sawyer@e-potek.ch',
      userName: 'Tom Sawyer',
      referringUserId: 'pro',
      referringUserName: 'Pro User',
      referringOrganisationId: 'proOrg',
      referringOrganisationName: 'org',
      assigneeId: 'advisor',
      assigneeName: 'Advisor E-Potek',
    };

    it('tracks LOAN_CREATED event', async () => {
      await ddpWithUserId('user', () => userLoanInsert.run({}));

      const [[{ userId, event, properties }]] = await waitForStub(analyticsSpy);

      expect(userId).to.equal('user');
      expect(event).to.equal(EVENTS_CONFIG[EVENTS.LOAN_CREATED].name);
      expect(properties).to.deep.include(commonProperties);
    });

    it('tracks LOAN_CREATED event with a property', async () => {
      await ddpWithUserId('user', () =>
        userLoanInsert.run({ proPropertyId: 'property' }),
      );

      const [[{ userId, event, properties }]] = await waitForStub(analyticsSpy);

      expect(userId).to.equal('user');
      expect(event).to.equal(EVENTS_CONFIG[EVENTS.LOAN_CREATED].name);
      expect(properties).to.deep.include({
        ...commonProperties,
        propertyId: 'property',
      });
    });
  });

  describe('adminLoanInsert', () => {
    const commonProperties = {
      anonymous: false,
      userEmail: 'tom.sawyer@e-potek.ch',
      userName: 'Tom Sawyer',
      referringUserId: 'pro',
      referringUserName: 'Pro User',
      referringOrganisationId: 'proOrg',
      referringOrganisationName: 'org',
      assigneeId: 'advisor',
      assigneeName: 'Advisor E-Potek',
    };
    it('tracks LOAN_CREATED event', async () => {
      await ddpWithUserId('advisor', () =>
        adminLoanInsert.run({ userId: 'user' }),
      );

      const [[{ userId, event, properties }]] = await waitForStub(analyticsSpy);

      expect(userId).to.equal('user');
      expect(event).to.equal(EVENTS_CONFIG[EVENTS.LOAN_CREATED].name);
      expect(properties).to.deep.include(commonProperties);
    });
  });

  describe('proInviteUser', () => {
    const commonProperties = {
      anonymous: false,
      userEmail: 'bob.dylan@e-potek.ch',
      userName: 'Bob Dylan',
      referringUserId: 'pro',
      referringUserName: 'Pro User',
      referringOrganisationId: 'proOrg',
      referringOrganisationName: 'org',
      assigneeId: 'advisor',
      assigneeName: 'Advisor E-Potek',
      propertyId: 'property',
    };
    it('tracks LOAN_CREATED event when invited to a property', async () => {
      let userId;
      await ddpWithUserId('pro', () =>
        proInviteUser
          .run({
            user: {
              firstName: 'Bob',
              lastName: 'Dylan',
              email: 'bob.dylan@e-potek.ch',
              phoneNumber: '12345678',
            },
            propertyIds: ['property'],
          })
          .then(({ userId: uid }) => {
            userId = uid;
          }),
      );

      const analyticsArgs = await waitForStub(analyticsSpy, 5);

      const [{ userId: uid, event, properties }] = analyticsArgs.find(
        args => args[0].event === EVENTS_CONFIG[EVENTS.LOAN_CREATED].name,
      ) || [{}];

      expect(uid).to.equal(userId);
      expect(event).to.equal(EVENTS_CONFIG[EVENTS.LOAN_CREATED].name);
      expect(properties).to.deep.include(commonProperties);

      await checkEmails(2);
    });
  });

  context('onboarding', () => {
    beforeEach(() => {
      generator({
        loans: [
          {
            _id: 'loan',
            userId: 'user',
            properties: [{ _id: 'property' }],
          },
          { _id: 'anonymousLoan', anonymous: true },
        ],
      });
    });

    describe('analyticsStartedOnboarding', () => {
      it('does not track the event if onboarding has already started', async () => {
        LoanService._update({
          id: 'loan',
          object: { hasStartedOnboarding: true },
        });

        await ddpWithUserId('user', () =>
          analyticsStartedOnboarding.run({ loanId: 'loan' }),
        );

        expect(analyticsSpy.called).to.equal(false);
      });

      it('does not track the event twice', async () => {
        await ddpWithUserId('user', () =>
          analyticsStartedOnboarding.run({ loanId: 'loan' }),
        );
        await ddpWithUserId('user', () =>
          analyticsStartedOnboarding.run({ loanId: 'loan' }),
        );

        expect(analyticsSpy.callCount).to.equal(1);
      });

      it('tracks the event if onboarding has not started yet', async () => {
        await ddpWithUserId('user', () =>
          analyticsStartedOnboarding.run({ loanId: 'loan' }),
        );

        const [[{ userId, event, properties }]] = await waitForStub(
          analyticsSpy,
        );

        expect(userId).to.equal('user');
        expect(event).to.equal(EVENTS_CONFIG[EVENTS.STARTED_ONBOARDING].name);
        expect(properties).to.deep.include({
          loanId: 'loan',
          userEmail: 'tom.sawyer@e-potek.ch',
          userName: 'Tom Sawyer',
          referringUserId: 'pro',
          referringUserName: 'Pro User',
          referringOrganisationId: 'proOrg',
          referringOrganisationName: 'org',
          assigneeId: 'advisor',
          assigneeName: 'Advisor E-Potek',
          propertyId: 'property',
          anonymous: false,
        });
      });

      it('tracks the event if onboarding has not started yet with an anonymous loan', async () => {
        await analyticsStartedOnboarding.run({ loanId: 'anonymousLoan' });

        const [[{ userId, event, properties }]] = await waitForStub(
          analyticsSpy,
        );

        expect(userId).to.equal(null);
        expect(event).to.equal(EVENTS_CONFIG[EVENTS.STARTED_ONBOARDING].name);
        expect(properties).to.deep.include({
          loanId: 'anonymousLoan',
          anonymous: true,
        });
      });
    });

    describe('analyticsOnboardingStep', () => {
      it('does not track anything if no latestStep is given', async () => {
        await ddpWithUserId('user', () =>
          analyticsOnboardingStep.run({
            loanId: 'loan',
            activeStep: 'purchaseType',
            currentTodoStep: 'purchaseType',
          }),
        );

        expect(analyticsSpy.called).to.equal(false);
      });

      it('does not track anything if activeStep is different than currentTodoStep', async () => {
        await ddpWithUserId('user', () =>
          analyticsOnboardingStep.run({
            loanId: 'loan',
            latestStep: 'purchaseType',
            activeStep: 'residenceType',
            currentTodoStep: 'canton',
          }),
        );

        expect(analyticsSpy.called).to.equal(false);
      });

      describe('tracks the event with correct properties when completedStep is', () => {
        const completeStep = ({ currentStep, completedStep }) =>
          ddpWithUserId('user', () =>
            analyticsOnboardingStep.run({
              loanId: 'loan',
              latestStep: completedStep,
              activeStep: currentStep,
              currentTodoStep: currentStep,
              previousStep: completedStep,
            }),
          );

        const commonProperties = {
          loanId: 'loan',
          userEmail: 'tom.sawyer@e-potek.ch',
          userName: 'Tom Sawyer',
          referringUserId: 'pro',
          referringUserName: 'Pro User',
          referringOrganisationId: 'proOrg',
          referringOrganisationName: 'org',
          assigneeId: 'advisor',
          assigneeName: 'Advisor E-Potek',
          propertyId: 'property',
          anonymous: false,
        };

        const checkAnalytics = async ({
          currentStep,
          completedStep,
          properties,
        }) => {
          const [[{ userId, event, properties: props }]] = await waitForStub(
            analyticsSpy,
          );

          expect(userId).to.equal('user');
          expect(event).to.equal(
            EVENTS_CONFIG[EVENTS.COMPLETED_ONBOARDING_STEP].name,
          );
          expect(props).to.deep.include({
            ...commonProperties,
            completedStep,
            currentStep,
            ...properties,
          });
        };

        it('purchaseType', async () => {
          const currentStep = 'acquisitionStatus';
          const completedStep = 'purchaseType';
          LoanService._update({
            id: 'loan',
            object: { purchaseType: PURCHASE_TYPE.ACQUISITION },
          });

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              purchaseType: PURCHASE_TYPE.ACQUISITION,
            },
          });
        });

        it('acquisitionStatus', async () => {
          const currentStep = 'residenceType';
          const completedStep = 'acquisitionStatus';
          LoanService._update({
            id: 'loan',
            object: {
              acquisitionStatus: ACQUISITION_STATUS.PROPERTY_IDENTIFIED,
            },
          });

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              acquisitionStatus: ACQUISITION_STATUS.PROPERTY_IDENTIFIED,
            },
          });
        });

        it('residenceType', async () => {
          const currentStep = 'canton';
          const completedStep = 'residenceType';
          LoanService._update({
            id: 'loan',
            object: {
              residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            },
          });

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
            },
          });
        });

        it('canton', async () => {
          const currentStep = 'propertyValue';
          const completedStep = 'canton';

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              canton: 'GE',
            },
          });
        });

        it('propertyValue', async () => {
          const currentStep = 'refinancing';
          const completedStep = 'propertyValue';

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              propertyValue: 1000000,
            },
          });
        });

        it('refinancing', async () => {
          const currentStep = 'borrowerCount';
          const completedStep = 'refinancing';

          LoanService._update({
            id: 'loan',
            object: {
              previousLoanTranches: [
                { value: 500000, dueDate: new Date(), rate: 0.01 },
                { value: 300000, dueDate: new Date(), rate: 0.01 },
              ],
            },
          });

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              previousLoanValue: 800000,
            },
          });
        });

        it('borrowerCount', async () => {
          const currentStep = 'birthDate';
          const completedStep = 'borrowerCount';

          generator({
            borrowers: [{ _id: 'b1' }, { _id: 'b2' }],
          });

          LoanService._update({
            id: 'loan',
            object: { borrowerIds: ['b1', 'b2'] },
          });

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              borrowerCount: 2,
            },
          });
        });

        it('birthDate', async () => {
          const currentStep = 'income';
          const completedStep = 'birthDate';
          const today = new Date();

          generator({
            borrowers: [
              { _id: 'b1', birthDate: today },
              { _id: 'b2', birthDate: today },
            ],
          });

          LoanService._update({
            id: 'loan',
            object: { borrowerIds: ['b1', 'b2'] },
          });

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              borrower1BirthDate: today,
              borrower2BirthDate: today,
            },
          });
        });

        it('income', async () => {
          const currentStep = 'ownFunds';
          const completedStep = 'income';

          generator({
            borrowers: [
              { _id: 'b1', salary: 100000 },
              { _id: 'b2', salary: 100000 },
            ],
          });

          LoanService._update({
            id: 'loan',
            object: { borrowerIds: ['b1', 'b2'] },
          });

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              borrowersSalary: 200000,
            },
          });
        });

        it('ownFunds', async () => {
          const currentStep = 'result';
          const completedStep = 'ownFunds';

          generator({
            borrowers: [
              { _id: 'b1', bankFortune: [{ value: 100000 }] },
              { _id: 'b2', bankFortune: [{ value: 100000 }] },
            ],
          });

          LoanService._update({
            id: 'loan',
            object: { borrowerIds: ['b1', 'b2'] },
          });

          await completeStep({
            currentStep,
            completedStep,
          });

          await checkAnalytics({
            currentStep,
            completedStep,
            properties: {
              borrowersFortune: 200000,
            },
          });
        });
      });
    });
  });
});
