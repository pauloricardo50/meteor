import React from 'react';
import PropTypes from 'prop-types';

import Uploader from './Uploader';

// Support for custom uploadX files
const getTitle = (id, doc) => {
  if (doc.logic) {
    const { closingSteps } = doc.logic;
    if (!closingSteps) {
      return undefined;
    }
    return id.indexOf('upload') >= 0
      ? (closingSteps.find(s => s.id === id) &&
          closingSteps.find(s => s.id === id).title) ||
          id
      : undefined;
  }

  return undefined;
};

const UploaderArray = ({ documentArray, doc, disabled, collection }) => (
  <div className="flex-col center">
    {documentArray
      ? documentArray.map(documentObject =>
        documentObject.condition !== false && (
          <Uploader
            fileMeta={{
              ...documentObject,
              title: getTitle(documentObject.id, doc),
            }}
            key={doc._id + documentObject.id}
            currentValue={doc.documents[documentObject.id].files}
            docId={doc._id}
            disabled={disabled}
            collection={collection}
          />
        ))
      : // Show all existing documents for this doc
      Object.keys(doc.documents).map(documentId => (
        <Uploader
          fileMeta={{ id: documentId, title: getTitle(documentId, doc) }}
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
