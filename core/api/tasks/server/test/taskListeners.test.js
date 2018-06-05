/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import {
  insertTaskWhenFileAdded,
  completeTaskOnFileVerification,
} from '../taskListeners';
import TaskService from '../../TaskService';

describe('Task Listeners', () => {
  describe('insertTaskWhenFileAdded', () => {
    // this test depends on EP-190 being merged into staging
    it.skip('listens to `addFileToDoc` method');

    it('calls `TaskService.insertTaskForAddedFile` function', () => {
      sinon.stub(TaskService, 'insertTaskForAddedFile');
      const listenerParams = {
        collection: 'loans',
        docId: 'someLoanId',
        userId: 'someUserId',
        documentId: 'someDocumentId',
        file: { key: 'someFileKey' },
      };

      expect(TaskService.insertTaskForAddedFile.called).to.equal(false);
      insertTaskWhenFileAdded(listenerParams);
      expect(TaskService.insertTaskForAddedFile.getCall(0).args).to.deep.equal([
        {
          collection: 'loans',
          docId: 'someLoanId',
          userId: 'someUserId',
          documentId: 'someDocumentId',
          fileKey: 'someFileKey',
        },
      ]);

      TaskService.insertTaskForAddedFile.restore();
    });
  });

  describe('completeTaskOnFileVerification', () => {
    // this test depends on EP-190 being merged into staging
    it.skip('listens to `setFileStatus` method');

    it('calls `TaskService.completeFileTask` function', () => {
      sinon.stub(TaskService, 'completeFileTask');

      const listenerParams = {
        collection: 'borrowers',
        docId: 'someLoanId',
        documentId: 'someDocumentId',
        fileKey: 'someFileKey',
        newStatus: 'VALID',
      };

      expect(TaskService.completeFileTask.called).to.equal(false);
      completeTaskOnFileVerification(listenerParams);
      expect(TaskService.completeFileTask.getCall(0).args).to.deep.equal([
        {
          collection: 'borrowers',
          docId: 'someLoanId',
          documentId: 'someDocumentId',
          fileKey: 'someFileKey',
        },
      ]);

      TaskService.completeFileTask.restore();
    });
  });
});
