// @flow
import React from 'react';
import omit from 'lodash/omit';

import { PropertySchemaAdmin } from 'core/api/properties/schemas/PropertySchema';
import { propertyUpdate, mortgageNoteInsert } from 'core/api';
import message from 'core/utils/message';
import AutoForm from '../AutoForm2';
import MortgageNotesForm from './MortgageNotesForm';

type BorrowerFormProps = {};

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
  'monthlyExpenses',
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
  const hideLoader = message.loading('...', 0);
  return propertyUpdate
    .run({ propertyId, object: omit(doc, omittedFields) })
    .finally(hideLoader)
    .then(() => message.success('Enregistré', 2));
};

const insertMortgageNote = (propertyId) => {
  const hideLoader = message.loading('...', 0);
  return mortgageNoteInsert
    .run({ propertyId })
    .finally(hideLoader)
    .then(() => message.success('Enregistré', 2));
};

const BorrowerForm = ({ property }: BorrowerFormProps) => {
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
export default BorrowerForm;
