import React from 'react';
import SimpleSchema from 'simpl-schema';

import { BORROWERS_COLLECTION } from '../../../api/borrowers/borrowerConstants';
import {
  removeAdditionalDoc,
  setAdditionalDoc,
} from '../../../api/methods/methodDefinitions';
import { PROPERTIES_COLLECTION } from '../../../api/properties/propertyConstants';
import AutoFormDialog from '../../AutoForm2/AutoFormDialog';
import Button from '../../Button';
import T from '../../Translation';

export const getAdditionalDocSchema = collection => {
  let allowedValues = [];

  if (collection === PROPERTIES_COLLECTION) {
    allowedValues = [
      'PROPERTY',
      'COPROPERTY',
      'INVESTMENT_BUILDING',
      'TAKEOVER',
      'SHARE',
      'OTHER',
    ];
  } else if (collection === BORROWERS_COLLECTION) {
    allowedValues = [
      'PERSONAL_DOCUMENTS',
      'PROFESSION',
      'INCOMES',
      'EXPENSES',
      'INSURANCE',
      'OWN_FUNDS',
      'OTHER',
    ];
  } else {
    allowedValues = ['OTHER'];
  }

  return new SimpleSchema({
    label: {
      type: String,
      uniforms: {
        label: 'Nom du document supplémentaire',
        placeholder: null,
      },
    },
    tooltip: {
      type: String,
      uniforms: {
        label: 'Description du document',
        placeholder: null,
      },
      optional: true,
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

const AdditionalDocModifier = ({ additionalDoc, docId, collection }) =>
  additionalDoc.label ? (
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
      autoFieldProps={{ labels: { label: 'Nom du document' } }}
      renderAdditionalActions={({ closeDialog, setDisableActions }) => (
        <Button
          onClick={() => {
            setDisableActions(true);
            return removeAdditionalDoc
              .run({
                collection,
                id: docId,
                additionalDocId: additionalDoc.id,
              })
              .then(closeDialog)
              .finally(() => setDisableActions(false));
          }}
          error
        >
          <T id="general.delete" />
        </Button>
      )}
    />
  ) : null;

export default AdditionalDocModifier;
