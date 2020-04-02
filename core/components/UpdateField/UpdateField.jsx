import React from 'react';
import pick from 'lodash/pick';

import { updateDocument } from '../../api/methods/methodDefinitions';
import AutoForm, { CustomAutoField } from '../AutoForm2';

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
  onSubmitCallback = () => ({}),
  extendSchema = {},
  ...props
}) => (
  <AutoForm
    autosave
    schema={schemas[collection].pick(...fields).extend(extendSchema)}
    model={doc}
    onSubmit={values => onSubmit(values).then(onSubmitCallback)}
    className="update-field"
    {...props}
  >
    {fields.map(field => (
      <CustomAutoField name={field} key={field} fullWidth />
    ))}
  </AutoForm>
);

export default UpdateField;
