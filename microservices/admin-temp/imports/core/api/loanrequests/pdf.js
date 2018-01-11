import React from 'react';
import InlineCss from 'react-inline-css';

export const AnonymousRequestPDF = (loanRequest, borrowers) => {
  return (
    <InlineCss
      stylesheet={`
      .Document {
        font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      }

      h1 {
        color: red;
      }`}
    >
      <div className="Document"><h1>Hello Yannis! (Anonymisé)</h1></div>
    </InlineCss>
  );
};

export const RequestPDF = (loanRequest, borrowers) => {
  return (
    <InlineCss
      stylesheet={`
      .Document {
        font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      }

      h1 {
        color: red;
      }`}
    >
      <div className="Document"><h1>Hello Yannis!</h1></div>
    </InlineCss>
  );
};
