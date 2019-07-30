import fs from 'fs';
import path from 'path';

import { FILE_UPLOAD_DIR } from 'core/api/RESTAPI/server/restApiConstants';

export const readFileBuffer = filePath => fs.readFileSync(filePath);
export const removeFile = filePath => fs.unlinkSync(filePath);

export const makeDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

export const flushDir = (dir) => {
  fs.readdir(dir, (error, files) => {
    if (error) {
      throw error;
    }

    [...files].forEach((file) => {
      removeFile(path.join(dir, file));
    });
  });
};

export const makeFileUploadDir = () => makeDir(FILE_UPLOAD_DIR);
export const flushFileUploadDir = () => flushDir(FILE_UPLOAD_DIR);
