import React from 'react';
import PropTypes from 'prop-types';
import T from 'core/components/Translation';
import FilesIssuesList from './FilesIssuesList';
import FieldsIssuesList from './FieldsIssuesList';

const BorrowerIssues = ({ borrowers }) => {
  const borrowerAdminValidations = borrowers.map(({ name, adminValidation, documents }, i) => ({
    key: i,
    borrowerName: name || (
      <T id="BorrowerIssues.itemTitle" values={{ index: i + 1 }} />
    ),
    fieldsIssues: <FieldsIssuesList adminValidation={adminValidation} />,
    filesIssues: <FilesIssuesList documents={documents} />,
  }));

  if (borrowerAdminValidations.length > 0) {
    return (
      <React.Fragment>
        <h4 className="bold">
          <T id="collections.borrowers" />
        </h4>
        <ul>
          {borrowerAdminValidations.map(({ key, borrowerName, fieldsIssues, filesIssues }) => (
            <li key={key}>
              <p className="bold">{borrowerName}</p>
              <ul>
                {fieldsIssues}
                {filesIssues}
              </ul>
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }

  return null;
};

BorrowerIssues.propTypes = {
  borrowers: PropTypes.array,
};

BorrowerIssues.defaultProps = {
  borrowers: [],
};

export default BorrowerIssues;
