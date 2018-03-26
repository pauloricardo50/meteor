import React from 'react';
import PropTypes from 'prop-types';
import { T } from 'core/components/Translation';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';
import FilesIssuesList from './FilesIssuesList';
import FieldsIssuesList from './FieldsIssuesList';

const BorrowerIssues = ({ borrowers, hasFileErrors }) => {
  const borrowerAdminValidations = borrowers.map(({ firstName, lastName, adminValidation, documents }, i) => ({
    key: i,
    borrowerName: getBorrowerFullName({ firstName, lastName }) || (
      <T id="BorrowerIssues.itemTitle" values={{ index: i + 1 }} />
    ),
    fieldsIssues: <FieldsIssuesList adminValidation={adminValidation} />,
    filesIssues: (
      <FilesIssuesList documents={documents} hasFileErrors={hasFileErrors} />
    ),
  }));

  if (borrowerAdminValidations.length > 0) {
    return (
      <div>
        <h4 className="bold">
          <T id="collections.borrowers" />
        </h4>
        <ul>
          {borrowerAdminValidations.map(({ key, borrowerName, fieldsIssues, filesIssues }) => (
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
  hasFileErrors: PropTypes.func.isRequired,
};

BorrowerIssues.defaultProps = {
  borrowers: [],
};

export default BorrowerIssues;
