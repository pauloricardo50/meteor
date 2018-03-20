import React from 'react';
import PropTypes from 'prop-types';

import Uploader from './Uploader';

const UploaderArray = ({ documentArray, doc, disabled, collection }) => (
  <div className="flex-col center">
    {documentArray
      ? documentArray.map(documentObject =>
        documentObject.condition !== false && (
          <Uploader
            fileMeta={{
              ...documentObject,
              ...doc.documents[documentObject.id],
            }}
            key={doc._id + documentObject.id}
            currentValue={doc.documents[documentObject.id].files}
            docId={doc._id}
            disabled={disabled}
            collection={collection}
          />
        ))
      : // Show all existing documents for this doc
      Object.keys(doc.documents)
        .sort((a, b) => doc.documents[a].isAdmin - doc.documents[b].isAdmin)
        .reverse()
        .map(documentId => (
          <Uploader
            fileMeta={{ id: documentId, ...doc.documents[documentId] }}
            collection={collection}
            key={documentId}
            docId={doc._id}
            currentValue={doc.documents[documentId].files}
            disabled={disabled}
          />
        ))}
  </div>
);

UploaderArray.propTypes = {
  documentArray: PropTypes.arrayOf(PropTypes.object),
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
  disabled: PropTypes.bool,
  collection: PropTypes.string.isRequired,
};

UploaderArray.defaultProps = {
  disabled: false,
  documentArray: undefined,
};

export default UploaderArray;
