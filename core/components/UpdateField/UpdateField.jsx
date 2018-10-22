// @flow
import React from 'react';
import pick from 'lodash/pick';

import AutoForm, { CustomAutoField } from '../AutoForm2';
import { loanUpdate } from '../../api';
import LoanSchema from '../../api/loans/schemas/LoanSchema';

type UpdateFieldProps = {};

const UpdateField = ({ fields, doc, onSuccess }: UpdateFieldProps) => (
  <AutoForm
    autosave
    schema={LoanSchema.pick(...fields)}
    model={doc}
    onSubmit={values =>
      loanUpdate
        .run({ loanId: doc._id, object: pick(values, fields) })
        .then(() => (onSuccess ? onSuccess(values) : null))
    }
    className="update-field"
  >
    {fields.map(field => (
      <CustomAutoField name={field} key={field} fullWidth />
    ))}
  </AutoForm>
);

export default UpdateField;
