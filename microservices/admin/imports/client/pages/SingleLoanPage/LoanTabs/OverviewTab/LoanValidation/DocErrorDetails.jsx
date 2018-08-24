import React from 'react';
import PropTypes from 'prop-types';
import T from 'core/components/Translation';
import FieldsIssuesList from './FieldsIssuesList';
import FilesIssuesList from './FilesIssuesList';

const DocErrorsDetails = ({ translationId, adminValidation, documents }) => (
  <React.Fragment>
    <h4 className="bold">
      <T id={translationId} />
    </h4>
    <FieldsIssuesList adminValidation={adminValidation} />
    <FilesIssuesList documents={documents} />
  </React.Fragment>
);

DocErrorsDetails.propTypes = {
  adminValidation: PropTypes.object.isRequired,
  documents: PropTypes.object.isRequired,
  translationId: PropTypes.string.isRequired,
};

export default DocErrorsDetails;
