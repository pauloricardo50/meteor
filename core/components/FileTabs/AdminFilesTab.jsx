import React from 'react';
import PropTypes from 'prop-types';

import UploaderArray from 'core/components/UploaderArray';
import { T } from 'core/components/Translation';
import { LOANS_COLLECTION } from 'core/api/constants';

const AdminFilesTab = ({ loan, style, disabled, isAdmin }) => {
  const { documents } = loan;
  const adminDocumentArray = Object.keys(documents)
    .filter(documentId => documents[documentId].isAdmin)
    .map(documentId => ({ id: documentId }));

  if (adminDocumentArray.length <= 0) {
    return (
      <h3 style={style}>
        <T id="AdminFilesTab.empty" />
      </h3>
    );
  }

  return (
    <div style={style}>
      <UploaderArray
        doc={loan}
        documentArray={adminDocumentArray}
        disabled={disabled}
        collection={LOANS_COLLECTION}
      />
    </div>
  );
};

AdminFilesTab.propTypes = {
  loan: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default AdminFilesTab;
