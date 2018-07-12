import React from 'react';
import PropTypes from 'prop-types';

import FileVerificator from './FileVerificator';

// Documents are required by default, and should only be hidden if
// the condition is explicitly false
const shouldShowDocument = condition => condition !== false;

const FilesVerificationTab = ({
  index,
  title,
  documentArray,
  doc,
  ...otherProps
}) => (
  <div style={{ padding: '40px 0' }}>
    {documentArray.map(({ condition, id: documentId }) =>
      shouldShowDocument(condition) && (
        <FileVerificator
          currentValue={
            doc.documents[documentId] && doc.documents[documentId].files
          }
          docId={doc._id}
          key={documentId}
          id={documentId}
          {...otherProps}
        />
      ))}
  </div>
);

FilesVerificationTab.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  documentArray: PropTypes.array.isRequired,
  doc: PropTypes.object.isRequired,
};

export default FilesVerificationTab;
