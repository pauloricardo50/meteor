import React from 'react';
import PropTypes from 'prop-types';

import UploaderArray from 'core/components/UploaderArray';
import { T } from 'core/components/Translation';

import AdminFilesTabContainer from './AdminFilesTabContainer';

const AdminFilesTab = ({ loan, style }) => {
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
      <UploaderArray doc={loan} documentArray={adminDocumentArray} disabled />
    </div>
  );
};

AdminFilesTab.propTypes = {};

export default AdminFilesTabContainer(AdminFilesTab);
