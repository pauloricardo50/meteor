/* eslint-env mocha */
import { expect } from 'chai';

import nextDueTaskReducer from '../nextDueTaskReducer';
import { TASK_STATUS } from '../../constants';

describe('nextDueTaskReducer', () => {
  it('returns undefined if no dates exist', () => {
    const loan = {};
    expect(nextDueTaskReducer(loan)).to.equal(undefined);
  });

  it('gets the next task date', () => {
    const taskDate1 = new Date();
    taskDate1.setDate(taskDate1.getDate() - 1);
    const taskDate2 = new Date();
    taskDate2.setDate(taskDate2.getDate() - 2);
    const tasksCache = [
      { dueAt: taskDate1, title: 'task A', status: TASK_STATUS.ACTIVE },
      { dueAt: taskDate2, title: 'task B', status: TASK_STATUS.ACTIVE },
    ];
    const loan = { tasksCache };
    expect(nextDueTaskReducer(loan)).to.deep.include({
      dueAt: taskDate2,
      title: 'task B',
    });
  });

  it('only returns active task dates', () => {
    const taskDate1 = new Date();
    taskDate1.setDate(taskDate1.getDate() - 1);
    const taskDate2 = new Date();
    taskDate2.setDate(taskDate2.getDate() - 2);
    const tasksCache = [
      { dueAt: taskDate1, title: 'task A', status: TASK_STATUS.ACTIVE },
      { dueAt: taskDate2, title: 'task B', status: TASK_STATUS.CANCELLED },
    ];
    const loan = { tasksCache };
    expect(nextDueTaskReducer(loan)).to.deep.include({
      dueAt: taskDate1,
      title: 'task A',
      status: TASK_STATUS.ACTIVE,
    });
  });

  it('puts tasks without due dates first', () => {
    const taskDate1 = new Date();
    taskDate1.setDate(taskDate1.getDate() - 1);
    const tasksCache = [
      { dueAt: taskDate1, title: 'task A', status: TASK_STATUS.ACTIVE },
      { title: 'task B', status: TASK_STATUS.ACTIVE },
    ];
    const loan = { tasksCache };
    expect(nextDueTaskReducer(loan)).to.deep.include({
      title: 'task B',
      status: TASK_STATUS.ACTIVE,
    });
  });

  it('puts older tasks first', () => {
    const taskDate1 = new Date();
    taskDate1.setDate(taskDate1.getDate() - 1);
    const taskDate2 = new Date();
    taskDate2.setDate(taskDate2.getDate() - 2);
    const taskDate3 = new Date();
    taskDate3.setDate(taskDate3.getDate() - 3);
    const tasksCache = [
      { dueAt: taskDate1, title: 'task A', status: TASK_STATUS.ACTIVE },
      { createdAt: taskDate2, title: 'task B', status: TASK_STATUS.ACTIVE },
      { createdAt: taskDate3, title: 'task C', status: TASK_STATUS.ACTIVE },
    ];
    const loan = { tasksCache };
    expect(nextDueTaskReducer(loan)).to.deep.include({
      title: 'task C',
      status: TASK_STATUS.ACTIVE,
    });
  });

  it('puts older tasks first', () => {
    const taskDate1 = new Date();
    taskDate1.setDate(taskDate1.getDate() - 1);
    const taskDate2 = new Date();
    taskDate2.setDate(taskDate2.getDate() - 2);
    const taskDate3 = new Date();
    taskDate3.setDate(taskDate3.getDate() - 3);
    const tasksCache = [
      { createdAt: taskDate2, title: 'task B', status: TASK_STATUS.ACTIVE },
      { dueAt: taskDate1, title: 'task A', status: TASK_STATUS.ACTIVE },
      { dueAt: taskDate3, title: 'task C', status: TASK_STATUS.ACTIVE },
    ];
    const loan = { tasksCache };
    expect(nextDueTaskReducer(loan)).to.deep.include({
      title: 'task B',
      status: TASK_STATUS.ACTIVE,
    });
  });
});
