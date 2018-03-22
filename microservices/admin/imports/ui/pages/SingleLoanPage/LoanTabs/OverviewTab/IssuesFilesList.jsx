import React from 'react';
import { T } from 'core/components/Translation';

export default ({ documents, checkFileErrors }) =>
  Object.keys(documents).map((key) => {
    // documents.buyersContract: {files: Array(1), uploadCount: 1, isAdmin: false}
    if (checkFileErrors(documents[key].files)) {
      return (
        <div>
          <p className="bold"> {documents[key].label || 'No label'}</p>
          <ul>
            {documents[key].files.map((file) => {
              // files[0]: {name: "fakeFile.pdf", initialName: "fakeFile.pdf", size: 10000, type: "application/pdf", url: "https://www.fake-url.com", …}
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
