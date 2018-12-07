// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { setAdditionalDoc } from '../../../api';
import { AutoFormDialog } from '../../AutoForm2';
import T from '../../Translation';

type AdditionalDocModifierProps = {
  additionalDoc: Object,
  docId: String,
  collection: String,
};

const schema = new SimpleSchema({
  label: { type: String, optional: false },
});

const AdditionalDocModifier = ({
  additionalDoc,
  docId,
  collection,
}: AdditionalDocModifierProps) =>
  (additionalDoc.label ? (
    <AutoFormDialog
      buttonProps={{ primary: true, label: <T id="general.modify" /> }}
      model={additionalDoc}
      schema={schema}
      onSubmit={object =>
        setAdditionalDoc.run({
          collection,
          id: docId,
          additionalDocId: additionalDoc.id,
          requiredByAdmin: additionalDoc.requiredByAdmin,
          label: object.label,
        })
      }
      autoFieldProps={{
        labels: { label: 'Nom du document' },
      }}
    />
  ) : null);

export default AdditionalDocModifier;
