import React from 'react';
import PropTypes from 'prop-types';
import { T } from 'core/components/Translation';

const FileIssueTemplate = ({ files, fileNameKey, label }) => (
  <ul>
    <li>
      <p className="bold">{label || <T id={`files.${fileNameKey}`} />}</p>
      <ul>
        {files.map(({ name, error }) => {
          if (error) {
            return (
              <li key={name}>
                <p className="file">
                  <T id="LoanValidation.file" />:{` ${name}`}
                </p>
                <p className="comment">
                  <T id="LoanValidation.comment" />: {error}
                </p>
              </li>
            );
          }

          return null;
        })}
      </ul>
    </li>
  </ul>
);

FileIssueTemplate.propTypes = {
  files: PropTypes.array.isRequired,
  fileNameKey: PropTypes.string.isRequired,
  label: PropTypes.string,
};

FileIssueTemplate.defaultProps = {
  label: '',
};

export default FileIssueTemplate;
