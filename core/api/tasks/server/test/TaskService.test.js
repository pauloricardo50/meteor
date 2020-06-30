import { Factory } from 'meteor/dburles:factory';

/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
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

  describe('taskSnooze', () => {
    let clock;

    beforeEach(() => {
      const someMonday = moment('2020-06-29');
      clock = sinon.useFakeTimers(someMonday.toDate().getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it('sets a new dueAt if there is none yet', () => {
      generator({ tasks: { _id: 'taskId' } });

      TaskService.snooze({ taskId: 'taskId', workingDays: 1 });

      const { dueAt } = TaskService.get('taskId', { dueAt: 1 });
      expect(moment(dueAt).day()).to.equal(2); // Sunday is 0
      expect(dueAt.getHours()).to.equal(8);
      expect(dueAt.getMinutes()).to.equal(0);
    });

    it('sets the date to monday if done on a saturday', () => {
      const someSaturday = moment('2020-06-27');
      clock = sinon.useFakeTimers(someSaturday.toDate().getTime());

      generator({ tasks: { _id: 'taskId' } });
      TaskService.snooze({ taskId: 'taskId', workingDays: 1 });

      const { dueAt } = TaskService.get('taskId', { dueAt: 1 });
      expect(moment(dueAt).day()).to.equal(1);
      expect(dueAt.getDate()).to.equal(29);
    });

    it('sets the date to monday if done on a friday', () => {
      const someSaturday = moment('2020-06-26');
      clock = sinon.useFakeTimers(someSaturday.toDate().getTime());

      generator({ tasks: { _id: 'taskId' } });
      TaskService.snooze({ taskId: 'taskId', workingDays: 1 });

      const { dueAt } = TaskService.get('taskId', { dueAt: 1 });
      expect(moment(dueAt).day()).to.equal(1);
      expect(dueAt.getDate()).to.equal(29);
    });

    it('adds multiple days to the date', () => {
      generator({ tasks: { _id: 'taskId' } });

      TaskService.snooze({ taskId: 'taskId', workingDays: 4 });

      const { dueAt } = TaskService.get('taskId', { dueAt: 1 });
      expect(dueAt.getMonth()).to.equal(6); // January is 0
      expect(dueAt.getDate()).to.equal(3);
    });

    it('adds days to the dueAt if it is in the future', () => {
      generator({
        tasks: { _id: 'taskId', dueAt: moment('2020-07-02').toDate() },
      });

      TaskService.snooze({ taskId: 'taskId', workingDays: 1 });

      const { dueAt } = TaskService.get('taskId', { dueAt: 1 });
      expect(dueAt.getMonth()).to.equal(6);
      expect(dueAt.getDate()).to.equal(3);
    });

    it('ignores dueAt if in the past', () => {
      generator({
        tasks: { _id: 'taskId', dueAt: moment('2020-06-25').toDate() },
      });

      TaskService.snooze({ taskId: 'taskId', workingDays: 1 });

      const { dueAt } = TaskService.get('taskId', { dueAt: 1 });
      expect(dueAt.getMonth()).to.equal(5);
      expect(dueAt.getDate()).to.equal(30);
    });
  });
});
