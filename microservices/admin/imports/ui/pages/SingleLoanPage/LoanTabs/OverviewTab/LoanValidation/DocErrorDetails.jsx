import React from 'react';
import PropTypes from 'prop-types';
import { T } from 'core/components/Translation';
import FieldsIssuesList from './FieldsIssuesList';
import FilesIssuesList from './FilesIssuesList';

const DocErrorsDetails = ({
  translationId,
  adminValidation,
  documents,
  hasFileErrors,
}) => (
  <div key={translationId}>
    <h4 className="bold">
      <T id={translationId} />
    </h4>
    <FieldsIssuesList adminValidation={adminValidation} />
    <FilesIssuesList documents={documents} hasFileErrors={hasFileErrors} />
  </div>
);

DocErrorsDetails.propTypes = {
  translationId: PropTypes.string.isRequired,
  adminValidation: PropTypes.object.isRequired,
  documents: PropTypes.object.isRequired,
  hasFileErrors: PropTypes.func.isRequired,
};

export default DocErrorsDetails;
