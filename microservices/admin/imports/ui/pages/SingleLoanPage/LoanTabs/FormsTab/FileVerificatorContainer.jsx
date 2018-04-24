import { createContainer, setFileStatus, setFileError } from 'core/api';

const FileVerificatorContainer = createContainer(({ collection, docId, id: documentId }) => ({
  setFileStatus: (fileKey, newStatus) =>
    setFileStatus.run({ collection, docId, documentId, fileKey, newStatus }),
  setFileError: (fileKey, error) =>
    setFileError.run({ collection, docId, documentId, fileKey, error }),
}));

export default FileVerificatorContainer;
