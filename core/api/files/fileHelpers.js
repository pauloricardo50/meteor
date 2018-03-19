import { FILE_STATUS } from './fileConstants';

export const getFileCount = (currentValue) => {
  let fileCountString = '00';
  let fileCount = 0;
  if (currentValue && currentValue.length > 0) {
    // If something goes wrong, minimum should be -1 + 1 = 0
    fileCount = Math.max(...currentValue.map(f => f.fileCount), -1) + 1;
    fileCountString = fileCount < 10 ? `0${fileCount}` : `${fileCount}`;
  }
  return { fileCount, fileCountString };
};

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

export const fakeDocument = {
  files: [fakeFile],
  uploadCount: 1,
  label: undefined,
  isAdmin: false,
};
