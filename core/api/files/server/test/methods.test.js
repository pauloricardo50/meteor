/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import ServerEventService from '../../../events/ServerEventService';
import { setFileStatus, notifyAdmin } from '../../../methods';
import FileService from '../../FileService';
import SecurityService from '../../../security';
import { FILE_STATUS } from '../../../constants';

describe('File methods', () => {
  describe('setFileStatus', () => {
    const setFileStatusParams = {
      collection: 'borrowers',
      docId: 'someBorrowerId',
      documentId: 'someDocumentId',
      fileKey: 'a/fake/file.key',
      newStatus: FILE_STATUS.VALID,
    };

    beforeEach(() => {
      sinon.stub(ServerEventService, 'emitMethod');
      sinon.stub(notifyAdmin, 'run');
      sinon.stub(SecurityService.borrowers, 'isAllowedToUpdate');
      sinon.stub(FileService, 'setFileStatus');
    });

    afterEach(() => {
      ServerEventService.emitMethod.restore();
      notifyAdmin.run.restore();
      SecurityService.borrowers.isAllowedToUpdate.restore();
      FileService.setFileStatus.restore();
    });

    it(`runs the \`notifyAdmin\` method with correct arguments
        when new file status is \`VALID\``, async () => {
      expect(notifyAdmin.run.called).to.equal(false);

      await setFileStatus.run({
        ...setFileStatusParams,
        newStatus: FILE_STATUS.VALID,
      });

      expect(notifyAdmin.run.getCall(0).args).to.deep.equal([
        {
          title: 'Task Completed',
          message: 'Completed task for added file',
        },
      ]);
    });

    it(`runs the \`notifyAdmin\` method with correct arguments
        when new file status is \`ERROR\``, async () => {
      expect(notifyAdmin.run.called).to.equal(false);

      await setFileStatus.run({
        ...setFileStatusParams,
        newStatus: FILE_STATUS.ERROR,
      });

      expect(notifyAdmin.run.getCall(0).args).to.deep.equal([
        {
          title: 'Task Completed',
          message: 'Completed task for added file',
        },
      ]);
    });

    it(`does not runs the \`notifyAdmin\` method when the
        new file status is neither \`ERROR\` or \`VALID\``, async () => {
      await setFileStatus.run({
        ...setFileStatusParams,
        newStatus: FILE_STATUS.UNVERIFIED,
      });

      expect(notifyAdmin.run.called).to.equal(false);
    });
  });
});
