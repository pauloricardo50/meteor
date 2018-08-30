import React from 'react';
import PropTypes from 'prop-types';

import FileVerificator from './FileVerificator';
import Loading from '../../../../../core/components/Loading/Loading';

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
  <div className="files-verification-tab">
    {doc.documents ? (
      documentArray.map(({ condition, id: documentId }) =>
        shouldShowDocument(condition) && (
          <FileVerificator
            currentValue={doc.documents[documentId]}
            docId={doc._id}
            key={documentId}
            id={documentId}
            {...otherProps}
          />
        ))
    ) : (
      <Loading />
    )}
  </div>
);

FilesVerificationTab.propTypes = {
  doc: PropTypes.object.isRequired,
  documentArray: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  title: PropTypes.string,
};

export default FilesVerificationTab;
