import React from 'react';
import PropTypes from 'prop-types';

import T from '../Translation';
import Uploader from './Uploader';

import UploaderArrayContainer from './UploaderArrayContainer';

export const UploaderArray = ({
  doc,
  documentArray,
  getFileMeta,
  allowRequireByAdmin = true,
  ...props
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
      {documentArray.map(documentObject => (
        <Uploader
          fileMeta={
            getFileMeta({ doc, id: documentObject.id }) || documentObject
          }
          key={doc._id + documentObject.id}
          currentValue={doc.documents && doc.documents[documentObject.id]}
          docId={doc._id}
          allowRequireByAdmin={allowRequireByAdmin}
          {...props}
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
