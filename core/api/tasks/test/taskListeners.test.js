/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { ClientEventService } from '../../events';
import '../../events/registerClientListeners';
import { setFileStatus, completeAddAssignedToTask } from '../../methods';
import {
  notifyAdminOfCompletedTaskOnFileStatusChangedListener,
  notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener,
} from '../taskClientListeners';
import TaskService from '../TaskService';

describe('Task Client Listeners', () => {
  describe('notifyAdminOfCompletedTaskOnFileStatusChangedListener', () => {
    it(`listens to \`${setFileStatus.config.name}\` method`, () => {
      const {
        config: { name: methodName },
      } = setFileStatus;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(notifyAdminOfCompletedTaskOnFileStatusChangedListener)).to.equal(true);
    });

    //   it('calls `TaskService.insertTaskForAddedFile` function', () => {
    //     sinon.stub(TaskService, 'insertTaskForAddedFile');
    //     const listenerParams = {
    //       collection: 'loans',
    //       docId: 'someLoanId',
    //       userId: 'someUserId',
    //       documentId: 'someDocumentId',
    //       file: { key: 'someFileKey' },
    //     };
    //     expect(TaskService.insertTaskForAddedFile.called).to.equal(false);
    //     insertTaskWhenFileAddedListener(listenerParams);
    //     expect(TaskService.insertTaskForAddedFile.getCall(0).args).to.deep.equal([
    //       {
    //         collection: 'loans',
    //         docId: 'someLoanId',
    //         userId: 'someUserId',
    //         documentId: 'someDocumentId',
    //         fileKey: 'someFileKey',
    //       },
    //     ]);
    //     TaskService.insertTaskForAddedFile.restore();
    //   });
  });
});
