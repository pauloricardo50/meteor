import { FILE_STATUS } from './fileConstants';

export const getUploadCountPrefix = lastUploadCount =>
  (lastUploadCount < 10 ? `0${lastUploadCount}` : `${lastUploadCount}`);

export const fakeFile = {
  name: 'fakeFile.pdf',
  initialName: 'fakeFile.pdf',
  size: 10000,
  type: 'application/pdf',
  url: 'https://www.fake-url.com',
  key: 'asdf/fakeKey/fakeFile.pdf',
  fileCount: 0,
};

export const validFakeFile = {
  ...fakeFile,
  name: 'validFakeFile.pdf',
  key: 'asdf/fakeKey/validFakeFile.pdf',
  status: FILE_STATUS.VALID,
  error: '',
};

export const invalidFakeFile = {
  ...fakeFile,
  name: 'invalidFakeFile.pdf',
  key: 'asdf/fakeKey/invalidFakeFile.pdf',
  error: 'Incorrect file format',
  status: FILE_STATUS.ERROR,
};

export const fakeDocument = {
  files: [validFakeFile, invalidFakeFile],
  uploadCount: 1,
  label: undefined,
  isAdmin: false,
};

export const fakeDocumentWithLabel = {
  ...fakeDocument,
  label: 'My super important document',
};
