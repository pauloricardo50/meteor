import React from 'react';
import { T } from 'core/components/Translation';

export default ({ documents, hasFileErrors }) =>
  Object.keys(documents).map((key) => {
    const { files, label } = documents[key];

    if (!hasFileErrors(files)) {
      return null;
    }

    return (
      <ul key={key}>
        <li key={key}>
          <p className="bold">{label || <T id={`files.${key}`} />}</p>
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
  });
