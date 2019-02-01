import S3Service from '../../../../files/server/S3Service';

export const zipDocuments = ({ zip, documents, formatFileName }) => {
  const promises = documents.map(document =>
    S3Service.getObject(document.Key).then((data) => {
      zip.append(data.Body, { name: formatFileName(document) });
    }));

  return Promise.all(promises);
};
