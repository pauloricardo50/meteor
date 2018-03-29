import React from 'react';
import PropTypes from 'prop-types';
import { T } from 'core/components/Translation';

const FieldsIssuesList = ({ adminValidation }) =>
  Object.keys(adminValidation).map(key => (
    <li key={key}>
      <p className="field">
        <T id="LoanValidation.field" />:{' '}
        <T id={`Forms.${key.replace('_', '.')}`} />
      </p>
      <p className="comment">
        <T id="LoanValidation.comment" />: {adminValidation[key]}
      </p>
    </li>
  ));

FieldsIssuesList.propTypes = {
  adminValidation: PropTypes.object.isRequired,
};

export default FieldsIssuesList;
