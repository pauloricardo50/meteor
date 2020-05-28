import { compose, withProps } from 'recompose';

import { deleteFile } from '../../../api/files/methodDefinitions';
import SecurityService from '../../../api/security/Security';
import UploaderController from './UploaderController';

const UploaderContainer = withProps(({ docId, disabled, doc, collection }) => {
  const userIsAdmin = SecurityService.currentUserIsAdmin();
  const docCollection = collection || doc?._collection;

  return {
    deleteFile: fileKey =>
      deleteFile.run({ collection: docCollection, docId, fileKey }),
    userIsAdmin,
    disabled: userIsAdmin ? false : disabled,
    collection: docCollection,
  };
});

export default compose(UploaderContainer, UploaderController);
