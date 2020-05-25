import { Meteor } from 'meteor/meteor';

import { useIntl } from 'react-intl';
import { withProps } from 'recompose';

import { documentHasTooltip } from '../../api/files/documents';
import { DOCUMENTS } from '../../api/files/fileConstants';

const getFileMetadata = (documentArray = [], id) => {
  const { metadata = {} } =
    documentArray.find(({ id: docId }) => id === docId) || {};
  return metadata;
};

const makeGetFileMeta = documentArray => ({
  doc: { additionalDocuments = [] },
  id,
}) => {
  const metadata = getFileMetadata(documentArray, id);
  return (
    additionalDocuments.find(document => document.id === id) && {
      noTooltips: !documentHasTooltip(id),
      ...additionalDocuments.find(document => document.id === id),
      ...metadata,
    }
  );
};

const makeSortDocuments = f => (a, b) => {
  if (a.id === DOCUMENTS.OTHER) {
    return 1;
  }

  const labelA = a.label || f({ id: `files.${a.id}` });
  const labelB = b.label || f({ id: `files.${b.id}` });

  return labelA.localeCompare(labelB);
};

export default withProps(({ documentArray, canModify }) => {
  const { formatMessage } = useIntl();

  return {
    documentArray: documentArray.sort(makeSortDocuments(formatMessage)),
    getFileMeta: makeGetFileMeta(documentArray),
    canModify: canModify && Meteor.microservice === 'admin',
  };
});
