import S3Service from '../../../../files/server/S3Service';
import { FILE_STATUS } from '../../../../files/fileConstants';

export const zipDocuments = ({
  zip,
  documents = {},
  formatFileName,
  options,
}) => {
  const { validatedOnly } = options;
  Object.keys(documents).forEach((document) => {
    const files = documents[document];
    const total = files.filter(({ status }) =>
      (validatedOnly ? status === FILE_STATUS.VALID : true)).length;
    const adminNameCount = files.reduce(
      (sum, { adminname }) => (adminname ? sum + 1 : sum),
      0,
    );
    const totalNoAdminNameCount = total - adminNameCount;
    let currentIndex = 0;
    const adminNameExists = adminNameCount > 0;
    files.forEach((file, index) => {
      const { adminname, status } = file;
      if (validatedOnly ? status === FILE_STATUS.VALID : true) {
        zip.append(S3Service.getObjectReadStream(file.Key), {
          name: formatFileName(
            file,
            adminNameExists ? (adminname ? 0 : currentIndex) : index,
            adminNameExists ? (adminname ? 1 : totalNoAdminNameCount) : total,
          ),
        });
        if (adminNameExists && !adminname) {
          currentIndex += 1;
        }
      }
    });
  });
};
