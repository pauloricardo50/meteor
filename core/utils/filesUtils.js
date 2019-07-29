import fs from 'fs';
import path from 'path';

import { FILE_UPLOAD_DIR } from 'core/api/RESTAPI/server/restApiConstants';

export const makeFileUploadDir = () => {
  if (!fs.existsSync(FILE_UPLOAD_DIR)) {
    fs.mkdirSync(FILE_UPLOAD_DIR);
  }
};

export const flushFileUploadDir = () => {
  fs.readdir(FILE_UPLOAD_DIR, (error, files) => {
    if (error) {
      throw error;
    }

    [...files].forEach((file) => {
      fs.unlink(path.join(FILE_UPLOAD_DIR, file), (err) => {
        if (err) {
          throw err;
        }
      });
    });
  });
};
