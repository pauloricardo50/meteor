import { withProps } from 'recompose';
import { setFileStatus, setFileError } from 'core/api';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from 'core/api/events/ClientEventService';

const FileVerificatorContainer = withProps(({ collection, docId }) => ({
  setFileStatus: (fileKey, newStatus) =>
    setFileStatus
      .run({ collection, docId, fileKey, newStatus })
      .then(() => ClientEventService.emit(MODIFIED_FILES_EVENT)),
  setFileError: (fileKey, error) =>
    setFileError
      .run({ collection, docId, fileKey, error })
      .then(() => ClientEventService.emit(MODIFIED_FILES_EVENT)),
}));

export default FileVerificatorContainer;
