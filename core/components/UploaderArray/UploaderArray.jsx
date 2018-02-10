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

const UploaderArray = ({
  fileArray, doc, disabled, collection,
}) => (
  <div className="flex-col center">
    {fileArray
      ? fileArray.map(file =>
            file.condition !== false && (
              <Uploader
                fileMeta={{ ...file, title: getTitle(file.id, doc) }}
                key={doc._id + file.id}
                currentValue={doc.files[file.id]}
                docId={doc._id}
                pushFunc={
                  collection === 'loans'
                    ? 'pushLoanValue'
                    : 'pushBorrowerValue'
                }
                updateFunc={
                  collection === 'loans'
                    ? 'updateLoan'
                    : 'updateBorrower'
                }
                disabled={disabled}
                collection={collection}
              />
            ))
      : // Show all existing files for this doc
        Object.keys(doc.files).map(fileId => (
          <Uploader
            fileMeta={{ id: fileId, title: getTitle(fileId, doc) }}
            collection={collection}
            key={fileId}
            docId={doc._id}
            currentValue={doc.files[fileId]}
            disabled={disabled}
          />
        ))}
  </div>
);

UploaderArray.propTypes = {
  fileArray: PropTypes.arrayOf(PropTypes.object),
  doc: PropTypes.objectOf(PropTypes.any).isRequired,
  disabled: PropTypes.bool,
  collection: PropTypes.string.isRequired,
};

UploaderArray.defaultProps = {
  disabled: false,
  fileArray: undefined,
};

export default UploaderArray;
