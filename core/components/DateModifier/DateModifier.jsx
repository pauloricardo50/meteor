// @flow
import React from 'react';
import moment from 'moment';
import AutoForm from 'uniforms-material/AutoForm';
import AutoField from 'uniforms-material/AutoField';
import uniforms from 'uniforms-material';
import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';
import DateField from '../DateField';
import { updateDocument } from '../../api';
import T from '../Translation';

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
  <AutoForm schema={schema} model={model} onSubmit={onSubmit} autosave>
    <p className="secondary">
      <T id={`Forms.${field}`} />
    </p>
    <AutoField name={field} label={false} />
  </AutoForm>
);

export default withProps(({ collection, doc, field }) => ({
  schema: new SimpleSchema({
    [field]: {
      type: Date,
      uniforms: { component: DateField, labelProps: { shrink: true } },
    },
  }),
  model: {
    [field]: doc[field] && moment(doc[field]).format('YYYY-MM-DD'),
  },
  onSubmit: object =>
    updateDocument.run({ collection, docId: doc._id, object }),
}))(DateModifier);
