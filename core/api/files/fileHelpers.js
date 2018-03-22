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
  status: FILE_STATUS.VALID,
  error: '',
};

export const fakeFileWithError = {
  name: 'fakeFileWithError.pdf',
  initialName: 'fakeFile.pdf',
  size: 10000,
  type: 'application/pdf',
  url: 'https://www.fake-url.com',
  key: 'asdf/fakeKey/fakeFile.pdf',
  fileCount: 0,
  status: FILE_STATUS.VALID,
  error: 'Incorrect file format',
};

export const fakeDocument = {
  files: [fakeFile, fakeFileWithError],
  uploadCount: 1,
  label: undefined,
  isAdmin: false,
};

export const fakeDocumentWithLabel = {
  files: [fakeFile, fakeFileWithError],
  uploadCount: 1,
  label: 'My super important document',
  isAdmin: false,
};
