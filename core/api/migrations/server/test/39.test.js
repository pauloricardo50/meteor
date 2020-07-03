/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import TaskService from '../../../tasks/server/TaskService';
import { up } from '../39';

describe('Migration 39', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('removes canceled status on a task', async () => {
      const updatedAt = new Date();
      await TaskService.collection
        .rawCollection()
        .insert({ _id: 'a', status: 'CANCELLED', updatedAt });
      await TaskService.collection
        .rawCollection()
        .insert({ _id: 'b', status: 'CANCELLED', updatedAt });
      await TaskService.collection
        .rawCollection()
        .insert({ _id: 'c', status: 'ACTIVE', updatedAt });

      await up();

      expect(TaskService.find({ status: 'CANCELLED' }).count()).to.equal(0);
      expect(TaskService.find({ status: 'ACTIVE' }).count()).to.equal(1);
      expect(TaskService.find({ status: 'COMPLETED' }).count()).to.equal(2);

      const task = TaskService.get('a', {
        status: 1,
        completedAt: 1,
        updatedAt: 1,
      });
      expect(task.status).to.equal('COMPLETED');
      expect(task.completedAt.getTime()).to.equal(task.updatedAt.getTime());
    });
  });
});
