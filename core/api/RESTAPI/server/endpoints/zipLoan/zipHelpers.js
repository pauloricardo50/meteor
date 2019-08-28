import S3Service from '../../../../files/server/S3Service';

export const zipDocuments = ({ zip, documents = {}, formatFileName }) => {
  Object.keys(documents).forEach((category) => {
    const files = documents[category];
    const total = files.length;
    const adminNameCount = files.reduce(
      (sum, { adminname }) => (adminname ? sum + 1 : sum),
      0,
    );
    const totalNoAdminNameCount = total - adminNameCount;
    let currentIndex = 0;
    const adminNameExists = adminNameCount > 0;
    files.forEach((file, index) => {
      const { adminname } = file;
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
    });
  });
};
