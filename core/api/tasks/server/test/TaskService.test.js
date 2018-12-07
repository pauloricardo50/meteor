// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import TaskService from '../../TaskService';
import { TASK_STATUS } from '../../taskConstants';

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
});
