import React from 'react';
import PropTypes from 'prop-types';
import { T } from 'core/components/Translation';
import FilesIssuesList from './FilesIssuesList';
import FieldsIssuesList from './FieldsIssuesList';

const BorrowerIssues = ({ borrowers, checkFileErrors }) => {
  const borrowersAdminValidation = borrowers.map(({ firstName, lastName, adminValidation, documents }, i) => ({
    key: i,
    borrowerName:
        firstName || lastName
          ? `${firstName} ${lastName}`
          : `Emprunteur ${i + 1}`,
    fieldsIssues: <FieldsIssuesList adminValidation={adminValidation} />,
    filesIssues: (
      <FilesIssuesList
        documents={documents}
        checkFileErrors={checkFileErrors}
      />
    ),
  }));

  if (borrowersAdminValidation.length > 0) {
    return (
      <div>
        <h4 className="bold">
          <T id="collections.borrowers" />
        </h4>
        <ul>
          {borrowersAdminValidation.map(({ key, borrowerName, fieldsIssues, filesIssues }) => (
            <li key={key}>
              <p className="bold">{borrowerName}</p>
              {fieldsIssues}
              {filesIssues}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

BorrowerIssues.propTypes = {
  borrowers: PropTypes.array,
  checkFileErrors: PropTypes.func.isRequired,
};

BorrowerIssues.defaultProps = {
  borrowers: [],
};

export default BorrowerIssues;
