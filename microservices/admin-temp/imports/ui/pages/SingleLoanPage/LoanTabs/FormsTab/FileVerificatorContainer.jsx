import { createContainer, setFileStatus, setFileError } from 'core/api';

const FileVerificatorContainer = createContainer(({ collection, docId, id: fileId }) => ({
  setFileStatus: (fileKey, newStatus) =>
    setFileStatus.run({ collection, docId, fileId, fileKey, newStatus }),
  setFileError: (fileKey, error) =>
    setFileError.run({ collection, docId, fileId, fileKey, error }),
}));

export default FileVerificatorContainer;
