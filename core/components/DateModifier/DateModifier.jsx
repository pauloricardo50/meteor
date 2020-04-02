import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { updateDocument } from '../../api/methods/methodDefinitions';
import AutoForm, { CustomAutoField } from '../AutoForm2';
import { CUSTOM_AUTOFIELD_TYPES } from '../AutoForm2/autoFormConstants';
import T from '../Translation';

const DateModifier = ({ schema, model, onSubmit, field }) => (
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
  model: { [field]: doc[field] },
  onSubmit: object =>
    updateDocument.run({ collection, docId: doc._id, object }),
}))(DateModifier);
