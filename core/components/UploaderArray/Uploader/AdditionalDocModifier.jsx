// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { setAdditionalDoc } from '../../../api';
import { AutoFormDialog } from '../../AutoForm2';
import T from '../../Translation';
import {
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
} from '../../../api/constants';

type AdditionalDocModifierProps = {
  additionalDoc: Object,
  docId: String,
  collection: String,
};

export const getAdditionalDocSchema = (collection) => {
  let allowedValues = [];

  if (collection === PROPERTIES_COLLECTION) {
    allowedValues = ['HOUSING', 'SHARE', 'OTHER'];
  } else if (collection === BORROWERS_COLLECTION) {
    allowedValues = [
      'PERSONAL_DOCUMENTS',
      'INCOMES_AND_EXPENSES',
      'FORTUNE_AND_OWN_FUNDS',
      'RETIREMENT',
      'OTHER',
    ];
  }

  return new SimpleSchema({
    label: {
      type: String,
      uniforms: {
        label: 'Nom du document supplémentaire',
        placeholder: null,
      },
    },
    category: {
      type: String,
      allowedValues,
      uniforms: {
        label: 'Catégorie',
        placeholder: null,
        transform: id => <T id={`files.category.${id}`} />,
      },
      condition: () => allowedValues.length > 0,
      defaultValue: 'OTHER',
    },
  });
};

const AdditionalDocModifier = ({
  additionalDoc,
  docId,
  collection,
}: AdditionalDocModifierProps) =>
  (additionalDoc.label ? (
    <AutoFormDialog
      buttonProps={{ primary: true, label: <T id="general.modify" /> }}
      model={additionalDoc}
      schema={getAdditionalDocSchema(collection)}
      onSubmit={object =>
        setAdditionalDoc.run({
          collection,
          id: docId,
          additionalDocId: additionalDoc.id,
          requiredByAdmin: additionalDoc.requiredByAdmin,
          ...object,
        })
      }
      autoFieldProps={{
        labels: { label: 'Nom du document' },
      }}
    />
  ) : null);

export default AdditionalDocModifier;
