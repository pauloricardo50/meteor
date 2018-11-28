// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import uniforms from 'uniforms-material';
import { withProps } from 'recompose';
import DateField from '../DateField';
import { updateDocument } from '../../api';

type DateModifierProps = {
  schema: Object,
  model: Object,
  onSubmit: Function,
};

const DateModifier = ({ schema, model, onSubmit }: DateModifierProps) => {
  console.log('schema', schema);

  return (
    <AutoForm schema={schema} model={model} onSubmit={onSubmit} autosave />
  );
};

export default withProps(({ collection, doc, dateField }) => ({
  schema: { [dateField]: { type: Date, uniforms: DateField } },
  model: { [dateField]: doc[dateField] },
  onSubmit: object =>
    updateDocument.run({ collection, docId: doc._id, object }),
}))(DateModifier);
