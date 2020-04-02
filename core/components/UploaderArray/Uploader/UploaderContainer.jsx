import { compose, withProps } from 'recompose';

import { deleteFile } from '../../../api/files/methodDefinitions';
import SecurityService from '../../../api/security/Security';
import UploaderController from './UploaderController';

const UploaderContainer = withProps(({ collection, docId, disabled }) => {
  const userIsAdmin = SecurityService.currentUserIsAdmin();

  return {
    deleteFile: fileKey => deleteFile.run({ collection, docId, fileKey }),
    userIsAdmin,
    disabled: userIsAdmin ? false : disabled,
  };
});

export default compose(UploaderContainer, UploaderController);
