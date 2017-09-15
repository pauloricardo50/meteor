import React from 'react';
import PropTypes from 'prop-types';

import Uploader from './Uploader';

const UploaderArray = ({ fileArray, doc, disabled, collection }) => (
  <div className="flex-col center">
    {fileArray ? (
      fileArray.map(
        file =>
          file.condition !== false && (
            <Uploader
              fileMeta={file}
              key={file.id}
              currentValue={doc.files[file.id]}
              docId={doc._id}
              pushFunc={
                collection === 'loanRequests' ? (
                  'pushRequestValue'
                ) : (
                  'pushBorrowerValue'
                )
              }
              updateFunc={
                collection === 'loanRequests' ? (
                  'updateRequest'
                ) : (
                  'updateBorrower'
                )
              }
              disabled={disabled}
              collection={collection}
            />
          ),
      )
    ) : (
      Object.keys(doc.files).map(fileId => (
        <Uploader
          fileMeta={{ id: fileId }}
          collection={collection}
          key={fileId}
          docId={doc._id}
          currentValue={doc.files[fileId]}
          disabled={disabled}
        />
      ))
    )}
  </div>
);

UploaderArray.propTypes = {
  fileArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
  disabled: PropTypes.bool,
  collection: PropTypes.string.isRequired,
};

UploaderArray.defaultProps = {
  disabled: false,
};

export default UploaderArray;
