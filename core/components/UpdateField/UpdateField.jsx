import React, { useMemo } from 'react';
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
  onSubmit = makeOnSubmit({
    collection: collection._name,
    doc,
    fields,
    onSuccess,
  }),
  onSubmitCallback = () => ({}),
  extendSchema = {},
  ...props
}) => {
  const schema = useMemo(
    () =>
      collection
        .simpleSchema()
        .pick(...fields)
        .extend(extendSchema),
    [],
  );
  return (
    <AutoForm
      autosave
      schema={schema}
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
};

export default UpdateField;
