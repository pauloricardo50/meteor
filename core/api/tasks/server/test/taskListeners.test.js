/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import ServerEventService from '../../../events/server/ServerEventService';
import '../../../events/server/registerServerListeners';
import { setFileStatus } from '../../../files/methodDefinitions';
import {
  insertTaskWhenFileAddedListener,
  completeTaskOnFileVerificationListener,
} from '../taskListeners';
import TaskService from '../../TaskService';

describe('Task Listeners', () => {
  describe('insertTaskWhenFileAddedListener', () => {
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
      insertTaskWhenFileAddedListener(listenerParams);
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

  describe('completeTaskOnFileVerificationListener', () => {
    it(`listens to '${setFileStatus.config.name}' method`, () => {
      const {
        config: { name: methodName },
      } = setFileStatus;

      const listeners = ServerEventService.getListenerFunctions(methodName);
      expect(listeners.includes(completeTaskOnFileVerificationListener)).to.equal(true);
    });

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
      completeTaskOnFileVerificationListener(listenerParams);
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
