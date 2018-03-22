import React from 'react';
import { T } from 'core/components/Translation';

export default ({ adminValidation }) =>
  Object.keys(adminValidation).map(key => (
    <li key={key}>
      <p clasName="field">
        <T id="LoanValidation.field" />:{' '}
        <T id={`Forms.${key.replace('_', '.')}`} />
      </p>
      <p className="comment">
        <T id="LoanValidation.comment" />: {adminValidation[key]}
      </p>
    </li>
  ));
