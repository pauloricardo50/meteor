// @flow
import React from 'react';
import pick from 'lodash/pick';

import AutoForm, { CustomAutoField } from '../AutoForm2';
import { updateDocument, schemas } from '../../api';

type UpdateFieldProps = {};

const makeOnSubmit = ({ collection, doc, fields, onSuccess }) => values =>
  updateDocument
    .run({ collection, docId: doc._id, object: pick(values, fields) })
    .then(() => (onSuccess ? onSuccess(values) : null));

const UpdateField = ({
  collection,
  doc,
  fields,
  onSuccess,
  onSubmit = makeOnSubmit({ collection, doc, fields, onSuccess }),
  ...props
}: UpdateFieldProps) => (
  <AutoForm
    autosave
    schema={schemas[collection].pick(...fields)}
    model={doc}
    onSubmit={onSubmit}
    className="update-field"
    {...props}
  >
    {fields.map(field => (
      <CustomAutoField name={field} key={field} fullWidth />
    ))}
  </AutoForm>
);

export default UpdateField;
