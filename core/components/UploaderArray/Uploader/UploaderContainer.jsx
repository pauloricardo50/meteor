import { compose } from 'recompose';

import { createContainer, deleteFile, SecurityService } from 'core/api';
import UploaderController from './UploaderController';

const UploaderContainer = createContainer(({ collection, docId, fileMeta: { isOwnedByAdmin }, disabled }) => {
  const userIsAdmin = SecurityService.currentUserIsAdmin();

  let disableUploader = true;

  if (isOwnedByAdmin) {
    disableUploader = true;
  } else {
    disableUploader = disabled;
  }

  return {
    deleteFile: fileKey => deleteFile.run({ collection, docId, fileKey }),
    userIsAdmin,
    disabled: userIsAdmin ? false : disableUploader,
    isOwnedByAdmin,
  };
});

export default compose(
  UploaderContainer,
  UploaderController,
);
