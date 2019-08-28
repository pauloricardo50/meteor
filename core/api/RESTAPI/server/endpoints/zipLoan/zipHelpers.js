import S3Service from '../../../../files/server/S3Service';

export const zipDocuments = ({ zip, documents = {}, formatFileName }) => {
  Object.keys(documents).forEach((category) => {
    const files = documents[category];
    const total = files.length;
    files.forEach((file, index) => {
      zip.append(S3Service.getObjectReadStream(file.Key), {
        name: formatFileName(file, index, total),
      });
    });
  });
};
