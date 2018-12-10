// @flow
import React from 'react';
import pick from 'lodash/pick';

import AutoForm, { CustomAutoField } from '../AutoForm2';
import { updateDocument, schemas } from '../../api';

type UpdateFieldProps = {};

const UpdateField = ({
  fields,
  doc,
  onSuccess,
  collection,
}: UpdateFieldProps) => (
  <AutoForm
    autosave
    schema={schemas[collection].pick(...fields)}
    model={doc}
    onSubmit={values =>
      updateDocument
        .run({ collection, docId: doc._id, object: pick(values, fields) })
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
