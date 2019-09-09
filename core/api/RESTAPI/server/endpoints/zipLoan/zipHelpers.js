import S3Service from '../../../../files/server/S3Service';

export const zipDocuments = ({
  zip,
  documents = {},
  formatFileName,
  options,
}) => {
  const { status } = options;
  Object.keys(documents).forEach((document) => {
    const files = documents[document];
    const total = files.filter(({ status: fileStatus }) =>
      status.includes(fileStatus)).length;
    const adminNameCount = files.reduce(
      (sum, { adminname }) => (adminname ? sum + 1 : sum),
      0,
    );
    const totalNoAdminNameCount = total - adminNameCount;
    let currentIndex = 0;
    const adminNameExists = adminNameCount > 0;
    files.forEach((file, index) => {
      const { adminname, status: fileStatus } = file;
      if (status.includes(fileStatus)) {
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

export const splitFilesInChunks = ({ docs = [], options, filesChunks }) => {
  const { status } = options;
  docs.forEach((doc) => {
    const { documents = {} } = doc;
    Object.keys(documents).forEach((document) => {
      const files = documents[document].filter(({ status: fileStatus }) =>
        status.includes(fileStatus));
      filesChunks.appendFiles(files);
    });
  });
  filesChunks.splitFilesInChunks();
};
