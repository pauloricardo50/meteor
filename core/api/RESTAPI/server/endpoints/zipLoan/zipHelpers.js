import S3Service from '../../../../files/server/S3Service';

export const zipDocuments = ({ zip, documents = {}, formatFileName }) => {
  Object.keys(documents).forEach((category) => {
    const files = documents[category];
    files.forEach((file) => {
      zip.append(S3Service.getObjectReadStream(file.Key), {
        name: formatFileName(file),
      });
    });
  });
};
