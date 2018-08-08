import React from 'react';
import PropTypes from 'prop-types';

import T from '../Translation';
import Uploader from './Uploader';

const UploaderArray = ({ documentArray, doc, disabled, collection }) => {
  if (documentArray) {
    return (
      <div className="flex-col center">
        {documentArray.map(documentObject =>
          documentObject.condition !== false && (
            <Uploader
              fileMeta={{
                ...documentObject,
                ...doc.documents[documentObject.id],
              }}
              key={doc._id + documentObject.id}
              currentValue={
                doc.documents[documentObject.id]
                  && doc.documents[documentObject.id].files
              }
              docId={doc._id}
              disabled={disabled}
              collection={collection}
            />
          ))}
      </div>
    );
  }

  const allDocuments = Object.keys(doc.documents);

  if (allDocuments.length === 0) {
    return (
      <p className="description">
        <T id="UploaderArray.empty" />
      </p>
    );
  }

  return (
    <div className="flex-col center">
      {Object.keys(doc.documents)
        .sort((a, b) => doc.documents[a].isAdmin - doc.documents[b].isAdmin)
        .reverse()
        .map(documentId => (
          <Uploader
            fileMeta={{ id: documentId, ...doc.documents[documentId] }}
            collection={collection}
            key={documentId}
            docId={doc._id}
            currentValue={
              doc.documents[documentId] && doc.documents[documentId].files
            }
            disabled={disabled}
          />
        ))}
    </div>
  );
};

UploaderArray.propTypes = {
  collection: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
  documentArray: PropTypes.arrayOf(PropTypes.object),
};

UploaderArray.defaultProps = {
  disabled: false,
  documentArray: undefined,
};

export default UploaderArray;
