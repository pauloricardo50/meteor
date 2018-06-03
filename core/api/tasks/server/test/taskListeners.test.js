/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { insertTaskWhenFileAdded } from '../taskListeners';
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
});
