import React from 'react';
import PropTypes from 'prop-types';

import T from '../Translation';
import Uploader from './Uploader';

import UploaderArrayContainer from './UploaderArrayContainer';

export const UploaderArray = ({
  doc,
  disabled,
  collection,
  documentArray,
  getFileMeta,
  currentUser,
  isDocumentToHide,
  allowRequireByAdmin = true,
}) => {
  console.log('documentArray', documentArray);
  if (!documentArray) {
    return null;
  }

  if (documentArray.length === 0) {
    return (
      <p className="description">
        <T id="UploaderArray.empty" />
      </p>
    );
  }

  return (
    <div className="flex-col center">
      {isDocumentToHide ? <h3>Autres documents</h3> : <h3>Documents requis</h3>}
      {documentArray.map(documentObject => (
        <Uploader
          fileMeta={
            getFileMeta({ doc, id: documentObject.id }) || documentObject
          }
          key={doc._id + documentObject.id}
          currentValue={doc.documents && doc.documents[documentObject.id]}
          docId={doc._id}
          disabled={disabled}
          collection={collection}
          currentUser={currentUser}
          isDocumentToHide={isDocumentToHide}
          allowRequireByAdmin={allowRequireByAdmin}
        />
      ))}
    </div>
  );
};

UploaderArray.propTypes = {
  collection: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
};

UploaderArray.defaultProps = {
  disabled: false,
};

export default UploaderArrayContainer(UploaderArray);
