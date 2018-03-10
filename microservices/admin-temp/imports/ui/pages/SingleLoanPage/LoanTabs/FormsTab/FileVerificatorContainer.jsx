import { createContainer, setFileStatus, setFileError } from 'core/api';

const FileVerificatorContainer = createContainer(({ isBorrower, isProperty, docId, id: fileId }) => {
  let collection = 'loans';
  if (isBorrower) {
    collection = 'borrowers';
  } else if (isProperty) {
    collection = 'properties';
  }
  return {
    setFileStatus: (fileKey, newStatus) =>
      setFileStatus.run({ collection, docId, fileId, fileKey, newStatus }),
    setFileError: (fileKey, error) =>
      setFileError.run({ collection, docId, fileId, fileKey, error }),
  };
});

export default FileVerificatorContainer;
