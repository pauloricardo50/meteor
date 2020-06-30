/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { PROMOTION_OPTION_STATUS } from '../../../promotionOptions/promotionOptionConstants';
import TaskService from '../../../tasks/server/TaskService';
import { TASK_TYPES } from '../../../tasks/taskConstants';
import { PROMOTION_STATUS } from '../../promotionConstants';
import {
  getBestPromotionLotStatus,
  getLoansWithoutStepReminderTask,
  getPromotionStepReminders,
  getPromotionsGettingDisbursedSoon,
  getStepGettingDisbursedSoon,
} from '../promotionServerHelpers';

describe('promotionServerHelpers', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('getBestPromotionLotStatus', () => {
    it('finds the best status of any promotionLot', () => {
      generator({
        properties: { _id: 'prop' },
        loans: {
          _id: 'loanId',
          promotionOptions: [
            {
              promotionLots: {
                status: 'SOLD',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId' },
              },
            },
            {
              promotionLots: {
                status: 'AVAILABLE',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId' },
              },
            },
          ],
        },
      });

      expect(getBestPromotionLotStatus({ loanId: 'loanId' })).to.equal('SOLD');
    });

    it('finds the best status of any promotionLot 2', () => {
      generator({
        properties: { _id: 'prop' },
        loans: {
          _id: 'loanId',
          promotionOptions: [
            {
              promotionLots: {
                status: 'SOLD',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId2' },
              },
            },
            {
              promotionLots: {
                status: 'AVAILABLE',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId' },
              },
            },
          ],
        },
      });

      expect(getBestPromotionLotStatus({ loanId: 'loanId' })).to.equal(
        'AVAILABLE',
      );
    });

    it('finds the best status of any promotionLot 3', () => {
      generator({
        properties: { _id: 'prop' },
        loans: {
          _id: 'loanId',
          promotionOptions: [
            {
              promotionLots: {
                status: 'RESERVED',
                propertyLinks: [{ _id: 'prop' }],
                attributedTo: { _id: 'loanId' },
              },
            },
          ],
        },
      });

      expect(getBestPromotionLotStatus({ loanId: 'loanId' })).to.equal(
        'RESERVED',
      );
    });
  });

  describe('getPromotionGettingDisbursedSoon', () => {
    describe('returns an empty array if', () => {
      it('no OPEN or FINISHED promotion are found', () => {
        generator({
          promotions: [
            { status: PROMOTION_STATUS.PREPARATION },
            { status: PROMOTION_STATUS.CANCELLED },
          ],
        });

        const promotions = getPromotionsGettingDisbursedSoon();

        expect(promotions.length).to.equal(0);
      });

      it('only test promotions are found', () => {
        generator({
          promotions: [{ status: PROMOTION_STATUS.FINISHED, isTest: true }],
        });

        const promotions = getPromotionsGettingDisbursedSoon();

        expect(promotions.length).to.equal(0);
      });

      it('signing date is in more than 10 days', () => {
        const in11Days = moment().add(11, 'days').startOf('day').toDate();
        generator({
          promotions: [
            { status: PROMOTION_STATUS.FINISHED, signingDate: in11Days },
          ],
        });

        const promotions = getPromotionsGettingDisbursedSoon();

        expect(promotions.length).to.equal(0);
      });

      it('construction timeline startPercent is 0', () => {
        const in10Days = moment().add(10, 'days').startOf('day').toDate();
        generator({
          promotions: [
            { status: PROMOTION_STATUS.FINISHED, signingDate: in10Days },
          ],
        });

        const promotions = getPromotionsGettingDisbursedSoon();

        expect(promotions.length).to.equal(0);
      });

      it('construction timeline endDate is in more than 10 days', () => {
        const in11Days = moment().add(11, 'days').startOf('day').toDate();
        generator({
          promotions: [
            {
              status: PROMOTION_STATUS.FINISHED,
              constructionTimeline: { endDate: in11Days },
            },
          ],
        });

        const promotions = getPromotionsGettingDisbursedSoon();

        expect(promotions.length).to.equal(0);
      });

      it('construction timeline endPercent is 0', () => {
        const in10Days = moment().add(10, 'days').startOf('day').toDate();
        generator({
          promotions: [
            {
              status: PROMOTION_STATUS.FINISHED,
              constructionTimeline: { endDate: in10Days },
            },
          ],
        });

        const promotions = getPromotionsGettingDisbursedSoon();

        expect(promotions.length).to.equal(0);
      });

      it('no step startDate is in less than 10 days', () => {
        const in11Days = moment().add(11, 'days').startOf('day').toDate();
        generator({
          promotions: [
            {
              status: PROMOTION_STATUS.FINISHED,
              constructionTimeline: {
                steps: [
                  { startDate: in11Days, description: 'My task', percent: 0.5 },
                ],
              },
            },
          ],
        });

        const promotions = getPromotionsGettingDisbursedSoon();

        expect(promotions.length).to.equal(0);
      });
    });

    it('returns the promotion with a signingDate step getting disbursed in 10 days', () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();
      generator({
        promotions: {
          _id: 'promo',
          signingDate: in10Days,
          status: PROMOTION_STATUS.FINISHED,
          constructionTimeline: { startPercent: 1 },
        },
      });

      const promotions = getPromotionsGettingDisbursedSoon();

      expect(promotions.length).to.equal(1);
      expect(promotions[0]._id).to.equal('promo');
    });

    it('returns the promotion with a endDate step getting disbursed in 10 days', () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();
      generator({
        promotions: {
          _id: 'promo',
          status: PROMOTION_STATUS.FINISHED,
          constructionTimeline: { endDate: in10Days, endPercent: 1 },
        },
      });

      const promotions = getPromotionsGettingDisbursedSoon();

      expect(promotions.length).to.equal(1);
      expect(promotions[0]._id).to.equal('promo');
    });

    it('returns the promotion with a step getting disbursed in 10 days', () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();
      generator({
        promotions: {
          _id: 'promo',
          status: PROMOTION_STATUS.FINISHED,
          constructionTimeline: {
            steps: [
              { startDate: in10Days, percent: 1, description: 'My task' },
            ],
          },
        },
      });

      const promotions = getPromotionsGettingDisbursedSoon();

      expect(promotions.length).to.equal(1);
      expect(promotions[0]._id).to.equal('promo');
    });

    it('returns the promotion with a step getting disbursed in 5 days', () => {
      const in5Days = moment().add(5, 'days').startOf('day').toDate();
      generator({
        promotions: {
          _id: 'promo',
          status: PROMOTION_STATUS.FINISHED,
          constructionTimeline: {
            steps: [{ startDate: in5Days, percent: 1, description: 'My task' }],
          },
        },
      });

      const promotions = getPromotionsGettingDisbursedSoon();

      expect(promotions.length).to.equal(1);
      expect(promotions[0]._id).to.equal('promo');
    });
  });

  describe('getStepGettingDisbursedSoon', () => {
    it('returns the signingDate step', () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();

      const step = getStepGettingDisbursedSoon({
        constructionTimeline: { startPercent: 1 },
        signingDate: in10Days,
        promotionId: 'promo',
      });

      expect(step).to.deep.include({
        type: TASK_TYPES.PROMOTION_SIGNING_DATE_STEP_REMINDER,
        id: 'promo',
        date: in10Days,
        description: 'Signature',
      });
    });

    it('returns the end step', () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();

      const step = getStepGettingDisbursedSoon({
        constructionTimeline: { endDate: in10Days, endPercent: 1 },
        promotionId: 'promo',
      });

      expect(step).to.deep.include({
        type: TASK_TYPES.PROMOTION_END_DATE_STEP_REMINDER,
        id: 'promo',
        date: in10Days,
        description: 'Remise des clés',
      });
    });

    it('returns the step', () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();

      const step = getStepGettingDisbursedSoon({
        constructionTimeline: {
          steps: [{ id: '1234', startDate: in10Days, description: 'My step' }],
        },
        promotionId: 'promo',
      });

      expect(step).to.deep.include({
        type: TASK_TYPES.PROMOTION_STEP_REMINDER,
        id: '1234',
        date: in10Days,
        description: 'My step',
      });
    });

    it('returns undefined if no step is found', () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();
      const in11Days = moment().add(11, 'days').startOf('day').toDate();

      const step = getStepGettingDisbursedSoon({
        signingDate: in10Days,
        constructionTimeline: {
          steps: [{ id: '1234', startDate: in11Days, description: 'My step' }],
          endDate: in10Days,
        },
        promotionId: 'promo',
      });

      expect(step).to.equal(undefined);
    });
  });

  describe('getLoansWithoutStepReminderTask', () => {
    it('returns null if no promotion option status is SOLD', () => {
      const loans = getLoansWithoutStepReminderTask({
        promotionOptions: [
          {
            status: PROMOTION_OPTION_STATUS.INTERESTED,
            loanCache: [{ _id: 'loan' }],
          },
        ],
      });

      expect(loans).to.equal(null);
    });

    it('returns an empty array if the loan already have the task', () => {
      const step = {
        type: TASK_TYPES.PROMOTION_STEP_REMINDER,
        id: '1234',
        date: new Date(),
      };
      generator({ loans: { _id: 'loan' } });

      TaskService.insert({
        object: {
          collection: 'loans',
          docId: 'loan',
          description: 'My task',
          type: step.type,
          metadata: { stepId: step.id, stepDate: step.date },
        },
      });

      const loans = getLoansWithoutStepReminderTask({
        promotionOptions: [
          {
            status: PROMOTION_OPTION_STATUS.SOLD,
            loanCache: [{ _id: 'loan' }],
          },
        ],
        step,
      });

      expect(loans.length).to.equal(0);
    });

    it('returns the loan if it does not already have the task', () => {
      const step = {
        type: TASK_TYPES.PROMOTION_STEP_REMINDER,
        id: '1234',
        date: new Date(),
      };
      generator({ loans: { _id: 'loan' } });

      const loans = getLoansWithoutStepReminderTask({
        promotionOptions: [
          {
            status: PROMOTION_OPTION_STATUS.SOLD,
            loanCache: [{ _id: 'loan' }],
          },
        ],
        step,
      });

      expect(loans.length).to.equal(1);
      expect(loans[0]._id).to.equal('loan');
    });

    it('returns the loan if it does have the task but for a different step id', () => {
      const step = {
        type: TASK_TYPES.PROMOTION_STEP_REMINDER,
        id: '1234',
        date: new Date(),
      };
      generator({ loans: { _id: 'loan' } });

      TaskService.insert({
        object: {
          collection: 'loans',
          docId: 'loan',
          description: 'My task',
          type: step.type,
          metadata: { stepId: '2345', stepDate: step.date },
        },
      });

      const loans = getLoansWithoutStepReminderTask({
        promotionOptions: [
          {
            status: PROMOTION_OPTION_STATUS.SOLD,
            loanCache: [{ _id: 'loan' }],
          },
        ],
        step,
      });

      expect(loans.length).to.equal(1);
      expect(loans[0]._id).to.equal('loan');
    });

    it('returns the loan if it does have the task but for a different step date', () => {
      const step = {
        type: TASK_TYPES.PROMOTION_STEP_REMINDER,
        id: '1234',
        date: new Date(),
      };
      generator({ loans: { _id: 'loan' } });

      TaskService.insert({
        object: {
          collection: 'loans',
          docId: 'loan',
          description: 'My task',
          type: step.type,
          metadata: {
            stepId: '1234',
            stepDate: moment().add(1, 'days').toDate(),
          },
        },
      });

      const loans = getLoansWithoutStepReminderTask({
        promotionOptions: [
          {
            status: PROMOTION_OPTION_STATUS.SOLD,
            loanCache: [{ _id: 'loan' }],
          },
        ],
        step,
      });

      expect(loans.length).to.equal(1);
      expect(loans[0]._id).to.equal('loan');
    });
  });

  describe('getPromotionStepReminders', () => {
    it('returns the steps and loans requiring a reminder', () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();

      generator({
        promotions: [
          {
            _id: 'promo1',
            status: PROMOTION_STATUS.FINISHED,
            signingDate: in10Days,
            constructionTimeline: { startPercent: 1 },
            promotionOptions: {
              loan: { _id: 'loan1' },
              status: PROMOTION_OPTION_STATUS.SOLD,
            },
          },
          {
            _id: 'promo2',
            status: PROMOTION_STATUS.FINISHED,
            constructionTimeline: { endDate: in10Days, endPercent: 1 },
            promotionOptions: {
              loan: { _id: 'loan2' },
              status: PROMOTION_OPTION_STATUS.SOLD,
            },
          },
          {
            _id: 'promo3',
            status: PROMOTION_STATUS.FINISHED,
            constructionTimeline: {
              steps: [
                {
                  id: '1234',
                  startDate: in10Days,
                  percent: 1,
                  description: 'My step',
                },
              ],
            },
            promotionOptions: {
              loan: { _id: 'loan3' },
              status: PROMOTION_OPTION_STATUS.SOLD,
            },
          },
        ],
      });

      const tasks = getPromotionStepReminders();

      expect(tasks.length).to.equal(3);

      const [task1, task2, task3] = tasks;

      expect(task1.step).to.deep.include({
        id: 'promo1',
        type: TASK_TYPES.PROMOTION_SIGNING_DATE_STEP_REMINDER,
        date: in10Days,
        description: 'Signature',
      });
      expect(task1.loanIds).to.deep.include('loan1');

      expect(task2.step).to.deep.include({
        id: 'promo2',
        type: TASK_TYPES.PROMOTION_END_DATE_STEP_REMINDER,
        date: in10Days,
        description: 'Remise des clés',
      });
      expect(task2.loanIds).to.deep.include('loan2');

      expect(task3.step).to.deep.include({
        id: '1234',
        type: TASK_TYPES.PROMOTION_STEP_REMINDER,
        date: in10Days,
        description: 'My step',
      });
      expect(task3.loanIds).to.deep.include('loan3');
    });
  });
});
