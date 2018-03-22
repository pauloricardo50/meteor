import React from 'react';
import { T } from 'core/components/Translation';

export default ({ documents, checkFileErrors }) =>
  Object.keys(documents).map((key) => {
    if (checkFileErrors(documents[key].files)) {
      return (
        <div>
          <p className="bold">
            {documents[key].label || <T id={`files.${key}`} />}
          </p>
          <ul>
            {documents[key].files.map((file) => {
              if (file.error) {
                return (
                  <li key={file.name}>
                    <p clasName="file">
                      <T id="LoanValidation.file" />:{` ${file.name}`}
                    </p>
                    <p className="comment">
                      <T id="LoanValidation.comment" />: {file.error}
                    </p>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      );
    }
    return null;
  });
