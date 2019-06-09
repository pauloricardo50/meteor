// @flow
import React from 'react';
import omit from 'lodash/omit';

import { PropertySchemaAdmin } from 'core/api/properties/schemas/PropertySchema';
import { propertyUpdate, mortgageNoteInsert } from 'core/api';
import AutoForm from '../AutoForm2';
import MortgageNotesForm from './MortgageNotesForm';

type PropertyFormProps = {};

const baseFields = [
  'status',
  'value',
  'address1',
  'address2',
  'zipCode',
  'city',
  'propertyType',
];
const detailFields = [
  'houseType',
  'flatType',
  'investmentRent',
  'constructionYear',
  'renovationYear',
  'insideArea',
  'areaNorm',
  'landArea',
  'terraceArea',
  'numberOfFloors',
  'floorNumber',
  'roomCount',
  'volume',
  'volumeNorm',
  'parkingInside',
  'parkingOutside',
  'gardenArea',
  'bathroomCount',
  'minergie',
  'isCoproperty',
  'isNew',
  'copropertyPercentage',
  'qualityProfileCondition',
  'qualityProfileStandard',
  'yearlyExpenses',
];

const omittedFields = [
  'loans',
  'user',
  'documents',
  'mortgageNotes',
  'mortgageNoteLinks',
  'canton',
];

const otherSchema = PropertySchemaAdmin.omit(
  ...baseFields,
  ...detailFields,
  ...omittedFields,
);

const handleSubmit = propertyId => (doc) => {
  let message;
  let hideLoader;

  return import('../../utils/message')
    .then(({ default: m }) => {
      message = m;
      hideLoader = message.loading('...', 0);
      return propertyUpdate.run({
        propertyId,
        object: omit(doc, omittedFields),
      });
    })
    .finally(() => {
      hideLoader();
    })
    .then(() => message.success('Enregistré', 2));
};

const insertMortgageNote = (propertyId) => {
  let message;
  let hideLoader;

  return import('../../utils/message')
    .then(({ default: m }) => {
      message = m;
      hideLoader = message.loading('...', 0);
      return mortgageNoteInsert.run({ propertyId });
    })
    .finally(() => {
      hideLoader();
    })
    .then(() => message.success('Enregistré', 2));
};

const PropertyForm = ({ property }: PropertyFormProps) => {
  const { _id: propertyId, mortgageNotes } = property;
  return (
    <div className="property-admin-form">
      <div>
        <h3>Informations de base</h3>
        <AutoForm
          schema={PropertySchemaAdmin.pick(...baseFields)}
          model={property}
          onSubmit={handleSubmit(property._id)}
          className="form"
        />
      </div>
      <div>
        <h3>État du bien</h3>
        <AutoForm
          schema={PropertySchemaAdmin.pick(...detailFields)}
          model={property}
          onSubmit={handleSubmit(property._id)}
          className="form"
        />
      </div>
      {otherSchema._schemaKeys.length > 0 && (
        <div>
          <h3>Autres</h3>
          <AutoForm
            schema={otherSchema}
            model={property}
            onSubmit={handleSubmit(property._id)}
            className="form"
          />
        </div>
      )}
      <MortgageNotesForm
        mortgageNotes={mortgageNotes}
        insertMortgageNote={insertMortgageNote}
        id={propertyId}
      />
    </div>
  );
};
export default PropertyForm;
