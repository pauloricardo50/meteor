import { Factory } from 'meteor/dburles:factory';

/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { PROMOTION_OPTION_STATUS } from '../../../promotionOptions/promotionOptionConstants';
import { PROMOTION_STATUS } from '../../../promotions/promotionConstants';
import PromotionService from '../../../promotions/server/PromotionService';
import { TASK_STATUS } from '../../taskConstants';
import TaskService from '../TaskService';

describe('TaskService', () => {
  let taskId;
  let task;

  beforeEach(() => {
    resetDatabase();
  });

  describe('hooks', () => {
    it('adds a completedAt date when status changes to COMPLETED', () => {
      taskId = Factory.create('task')._id;
      task = TaskService.get(taskId, { completedAt: 1 });
      expect(task.completedAt).to.equal(undefined);

      TaskService.update({ taskId, object: { status: TASK_STATUS.COMPLETED } });

      task = TaskService.get(taskId, { completedAt: 1 });
      expect(task.completedAt).to.not.equal(false);
    });

    it('removes the completedAt date when status changes from COMPLETED', () => {
      const date = new Date();
      taskId = Factory.create('task', {
        status: TASK_STATUS.COMPLETED,
        completedAt: date,
      })._id;
      task = TaskService.get(taskId, { completedAt: 1 });
      expect(task.completedAt.getTime()).to.equal(date.getTime());

      TaskService.update({ taskId, object: { status: TASK_STATUS.ACTIVE } });

      task = TaskService.get(taskId, { completedAt: 1 });
      expect(task.completedAt).to.equal(null);
    });
  });

  describe('getDueDate', () => {
    it('should return dueAt if provided', () => {
      const date = new Date();
      expect(TaskService.getDueDate({ dueAt: date })).to.equal(date);
    });

    it('should return a date with the right time', () => {
      const date = new Date();
      const currentHours = date.getHours();
      const nextHours = currentHours - 1;

      date.setDate(date.getDate() + 1);
      date.setHours(nextHours);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      const newDate = TaskService.getDueDate({
        dueAtTime: `${nextHours}:00`,
      });
      expect(newDate.getTime()).to.equal(date.getTime());
    });

    it('adds date and time if both are provided', () => {
      const date = new Date();
      date.setDate(date.getDate() + 2);

      const newDate = TaskService.getDueDate({
        dueAtTime: '5:30',
        dueAt: date,
      });

      expect(newDate.getHours()).to.equal(5);
      expect(newDate.getMinutes()).to.equal(30);
      expect(newDate.getSeconds()).to.equal(0);
      expect(newDate.getDate()).to.equal(date.getDate());
    });

    it('does not return an invalid date if dueAt is an empty string', () => {
      const newDate = TaskService.getDueDate({
        dueAtTime: '5:30',
        dueAt: '',
      });

      expect(moment(newDate).isValid()).to.equal(true);
    });
  });

  describe('generatePromotionStepReminders', () => {
    it('generates the tasks', async () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();

      generator({
        users: [
          { _id: 'admin', _factory: 'advisor' },
          { _id: 'user1', assignedEmployeeId: 'admin' },
          { _id: 'user2', assignedEmployeeId: 'admin' },
          { _id: 'user3', assignedEmployeeId: 'admin' },
        ],
        promotions: [
          {
            _id: 'promo1',
            status: PROMOTION_STATUS.FINISHED,
            signingDate: in10Days,
            constructionTimeline: { startPercent: 1 },
            promotionOptions: {
              loan: { _id: 'loan1', user: { _id: 'user1' } },
              status: PROMOTION_OPTION_STATUS.SOLD,
            },
          },
          {
            _id: 'promo2',
            status: PROMOTION_STATUS.FINISHED,
            constructionTimeline: { endDate: in10Days, endPercent: 1 },
            promotionOptions: {
              loan: { _id: 'loan2', user: { _id: 'user2' } },
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
              loan: { _id: 'loan3', user: { _id: 'user3' } },
              status: PROMOTION_OPTION_STATUS.SOLD,
            },
          },
        ],
      });

      const numberOfTasks = await TaskService.generatePromotionStepReminders();

      expect(numberOfTasks).to.equal(3);

      const tasks = TaskService.fetch({
        loanLink: 1,
        title: 1,
        assigneeLink: 1,
      });

      expect(tasks.length).to.equal(3);

      const [task1, task2, task3] = tasks;

      expect(task1).to.deep.include({
        title:
          'La tranche "Signature" sera décaissée dans 10 jours, contactez le client et le prêteur',
        loanLink: { _id: 'loan1' },
        assigneeLink: { _id: 'admin' },
      });
      expect(task2).to.deep.include({
        title:
          'La tranche "Remise des clés" sera décaissée dans 10 jours, contactez le client et le prêteur',
        loanLink: { _id: 'loan2' },
        assigneeLink: { _id: 'admin' },
      });
      expect(task3).to.deep.include({
        title:
          'La tranche "My step" sera décaissée dans 10 jours, contactez le client et le prêteur',
        loanLink: { _id: 'loan3' },
        assigneeLink: { _id: 'admin' },
      });
    });

    it('does not generates the tasks twice', async () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();

      generator({
        users: [
          { _id: 'admin', _factory: 'advisor' },
          { _id: 'user1', assignedEmployeeId: 'admin' },
        ],
        promotions: [
          {
            _id: 'promo1',
            status: PROMOTION_STATUS.FINISHED,
            signingDate: in10Days,
            constructionTimeline: { startPercent: 1 },
            promotionOptions: {
              loan: { _id: 'loan1', user: { _id: 'user1' } },
              status: PROMOTION_OPTION_STATUS.SOLD,
            },
          },
        ],
      });

      let numberOfTasks = await TaskService.generatePromotionStepReminders();
      expect(numberOfTasks).to.equal(1);

      numberOfTasks = await TaskService.generatePromotionStepReminders();
      expect(numberOfTasks).to.equal(0);

      const tasks = TaskService.fetch({
        loanLink: 1,
        title: 1,
        assigneeLink: 1,
      });

      expect(tasks.length).to.equal(1);
      expect(tasks[0]).to.deep.include({
        title:
          'La tranche "Signature" sera décaissée dans 10 jours, contactez le client et le prêteur',
        loanLink: { _id: 'loan1' },
        assigneeLink: { _id: 'admin' },
      });
    });

    it('does not generates the tasks twice 3 days after', async () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();

      generator({
        users: [
          { _id: 'admin', _factory: 'advisor' },
          { _id: 'user1', assignedEmployeeId: 'admin' },
        ],
        promotions: [
          {
            _id: 'promo1',
            status: PROMOTION_STATUS.FINISHED,
            signingDate: in10Days,
            constructionTimeline: { startPercent: 1 },
            promotionOptions: {
              loan: { _id: 'loan1', user: { _id: 'user1' } },
              status: PROMOTION_OPTION_STATUS.SOLD,
            },
          },
        ],
      });

      let numberOfTasks = await TaskService.generatePromotionStepReminders();
      expect(numberOfTasks).to.equal(1);

      const clock = sinon.useFakeTimers(Date.now());
      clock.tick(3 * 24 * 60 * 60 * 1000);

      numberOfTasks = await TaskService.generatePromotionStepReminders();
      expect(numberOfTasks).to.equal(0);

      clock.restore();

      const tasks = TaskService.fetch({
        loanLink: 1,
        title: 1,
        assigneeLink: 1,
      });

      expect(tasks.length).to.equal(1);
      expect(tasks[0]).to.deep.include({
        title:
          'La tranche "Signature" sera décaissée dans 10 jours, contactez le client et le prêteur',
        loanLink: { _id: 'loan1' },
        assigneeLink: { _id: 'admin' },
      });
    });

    it('regenerates the task if the step date changed', async () => {
      const in10Days = moment().add(10, 'days').startOf('day').toDate();
      const in5Days = moment().add(5, 'days').startOf('day').toDate();

      generator({
        users: [
          { _id: 'admin', _factory: 'advisor' },
          { _id: 'user1', assignedEmployeeId: 'admin' },
        ],
        promotions: [
          {
            _id: 'promo1',
            status: PROMOTION_STATUS.FINISHED,
            signingDate: in10Days,
            constructionTimeline: { startPercent: 1 },
            promotionOptions: {
              loan: { _id: 'loan1', user: { _id: 'user1' } },
              status: PROMOTION_OPTION_STATUS.SOLD,
            },
          },
        ],
      });

      let numberOfTasks = await TaskService.generatePromotionStepReminders();
      expect(numberOfTasks).to.equal(1);

      PromotionService._update({
        id: 'promo1',
        object: { signingDate: in5Days },
      });

      numberOfTasks = await TaskService.generatePromotionStepReminders();
      expect(numberOfTasks).to.equal(1);

      const tasks = TaskService.fetch({
        loanLink: 1,
        title: 1,
        assigneeLink: 1,
      });

      expect(tasks.length).to.equal(2);
      const [task1, task2] = tasks;

      expect(task1).to.deep.include({
        title:
          'La tranche "Signature" sera décaissée dans 10 jours, contactez le client et le prêteur',
        loanLink: { _id: 'loan1' },
        assigneeLink: { _id: 'admin' },
      });

      expect(task2).to.deep.include({
        title:
          'La tranche "Signature" sera décaissée dans 5 jours, contactez le client et le prêteur',
        loanLink: { _id: 'loan1' },
        assigneeLink: { _id: 'admin' },
      });
    });
  });
});
