// @flow
import React from 'react';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';
import AutoForm, { CustomAutoField } from '../AutoForm2';
import { updateDocument } from '../../api';
import T from '../Translation';
import { CUSTOM_AUTOFIELD_TYPES } from '../AutoForm2/constants';

type DateModifierProps = {
  schema: Object,
  model: Object,
  onSubmit: Function,
  field: String,
};

const DateModifier = ({
  schema,
  model,
  onSubmit,
  field,
}: DateModifierProps) => (
  <AutoForm
    schema={schema}
    model={model}
    onSubmit={onSubmit}
    autosave
    className="date-modifier"
  >
    <CustomAutoField name={field} label={<T id={`Forms.${field}`} />} />
  </AutoForm>
);

export default withProps(({ collection, doc, field }) => ({
  schema: new SimpleSchema({
    [field]: {
      type: Date,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    },
  }),
  model: {
    [field]: doc[field] && moment(doc[field]).format('YYYY-MM-DD'),
  },
  onSubmit: object =>
    updateDocument.run({ collection, docId: doc._id, object }),
}))(DateModifier);
