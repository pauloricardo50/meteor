// @flow
import React from 'react';
import moment from 'moment';
import AutoForm from 'uniforms-material/AutoForm';
import AutoField from 'uniforms-material/AutoField';
import UniformsDateField from 'uniforms-material/DateField';
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
  dateField: String,
};

const DateModifier = ({
  schema,
  model,
  onSubmit,
  dateField,
}: DateModifierProps) => (
  <AutoForm schema={schema} model={model} onSubmit={onSubmit} autosave>
    <p className="secondary">
      <T id={`Forms.${dateField}`} />
    </p>
    <AutoField name={dateField} label={false} />
  </AutoForm>
);

export default withProps(({ collection, doc, dateField }) => ({
  schema: new SimpleSchema({
    [dateField]: {
      type: Date,
      uniforms: { component: DateField, labelProps: { shrink: true } },
    },
  }),
  model: {
    [dateField]: doc[dateField] && moment(doc[dateField]).format('YYYY-MM-DD'),
  },
  onSubmit: object =>
    updateDocument.run({ collection, docId: doc._id, object }),
}))(DateModifier);
