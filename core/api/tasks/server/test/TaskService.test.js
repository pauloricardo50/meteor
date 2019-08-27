// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import moment from 'moment';

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
      task = TaskService.get(taskId);
      expect(task.completedAt).to.equal(undefined);

      TaskService.update({ taskId, object: { status: TASK_STATUS.COMPLETED } });

      task = TaskService.get(taskId);
      expect(task.completedAt).to.not.equal(false);
    });

    it('removes the completedAt date when status changes from COMPLETED', () => {
      const date = new Date();
      taskId = Factory.create('task', {
        status: TASK_STATUS.COMPLETED,
        completedAt: date,
      })._id;
      task = TaskService.get(taskId);
      expect(task.completedAt.getTime()).to.equal(date.getTime());

      TaskService.update({ taskId, object: { status: TASK_STATUS.ACTIVE } });

      task = TaskService.get(taskId);
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
});
