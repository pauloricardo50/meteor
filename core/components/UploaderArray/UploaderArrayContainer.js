import { Meteor } from 'meteor/meteor';
import { withProps, compose } from 'recompose';
import { injectIntl } from 'react-intl';
import { DOCUMENTS, DOCUMENTS_WITH_TOOLTIP } from '../../api/constants';

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
      noTooltips: !DOCUMENTS_WITH_TOOLTIP.some(documentId => documentId === id),
      ...additionalDocuments.find(document => document.id === id),
      ...metadata,
    }
  );
};

const makeSortDocuments = ({ formatMessage: f }) => (a, b) => {
  if (a.id === DOCUMENTS.OTHER) {
    return 1;
  }

  const labelA = a.label || f({ id: `files.${a.id}` });
  const labelB = b.label || f({ id: `files.${b.id}` });

  return labelA.localeCompare(labelB);
};

export default compose(
  injectIntl,
  withProps(({ documentArray, intl, canModify }) => ({
    documentArray: documentArray.sort(makeSortDocuments(intl)),
    getFileMeta: makeGetFileMeta(documentArray),
    canModify: canModify && Meteor.microservice === 'admin',
  })),
);
