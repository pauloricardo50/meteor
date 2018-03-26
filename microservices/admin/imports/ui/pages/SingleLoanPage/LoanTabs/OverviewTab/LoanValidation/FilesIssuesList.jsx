import React from 'react';
import FileIssueTemplate from './FileIssueTemplate';

export default ({ documents, hasFileErrors }) =>
  Object.keys(documents).map((key) => {
    const { files, label } = documents[key];

    if (!hasFileErrors(files)) {
      return null;
    }

    return (
      <FileIssueTemplate
        key={key}
        files={files}
        fileNameKey={key}
        label={label}
      />
    );
  });
