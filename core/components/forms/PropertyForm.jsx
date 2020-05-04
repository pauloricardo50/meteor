import React from 'react';
import omit from 'lodash/omit';

import { mortgageNoteInsert } from '../../api/mortgageNotes/methodDefinitions';
import { propertyUpdate } from '../../api/properties/methodDefinitions';
import { PropertySchemaAdmin } from '../../api/properties/schemas/PropertySchema';
import AutoForm from '../AutoForm2';
import Box from '../Box';
import MortgageNotesForm from './MortgageNotesForm';

const baseFields = [
  'status',
  'value',
  'address1',
  'address2',
  'zipCode',
  'city',
  'country',
  'propertyType',
  'constructionYear',
  'renovationYear',
  'landValue',
  'additionalMargin',
  'constructionValue',
];

const detailFields = [
  'houseType',
  'flatType',
  'investmentRent',
  'areaNorm',
  'insideArea',
  'landArea',
  'terraceArea',
  'gardenArea',
  'numberOfFloors',
  'floorNumber',
  'roomCount',
  'volume',
  'volumeNorm',
  'parkingInside',
  'parkingOutside',
  'bathroomCount',
  'minergie',
  'isNew',
  'isCoproperty',
  'copropertyPercentage',
  'yearlyExpenses',
];

const omittedFields = [
  'loans',
  'user',
  'documents',
  'mortgageNotes',
  'mortgageNoteLinks',
  'canton',
  'externalId',
  'externalUrl',
  'imageUrls',
  'category',
];

const otherSchema = PropertySchemaAdmin.omit(
  ...baseFields,
  ...detailFields,
  ...omittedFields,
);

const handleSubmit = propertyId => doc => {
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

const insertMortgageNote = propertyId => {
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

const PropertyForm = ({ property }) => {
  const { _id: propertyId, mortgageNotes } = property;
  return (
    <div className="property-admin-form">
      <h3>Informations de base</h3>
      <AutoForm
        schema={PropertySchemaAdmin.pick(...baseFields)}
        model={property}
        onSubmit={handleSubmit(property._id)}
        className="form"
        layout={[
          {
            Component: Box,
            layout: [
              'value',
              {
                Component: () => (
                  <div className="text-center" style={{ margin: '16 0' }}>
                    <h4>--- ou ---</h4>
                  </div>
                ),
              },
              {
                fields: ['landValue', 'additionalMargin', 'constructionValue'],
                className: 'grid-3',
              },
            ],
            className: 'mb-32',
          },
          {
            fields: [
              'status',
              'propertyType',
              'constructionYear',
              'renovationYear',
            ],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: ['address1', 'address2', 'zipCode', 'city', 'country'],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: '__REST',
            className: 'grid-col',
          },
        ]}
      />
      <h3>État du bien</h3>
      <AutoForm
        schema={PropertySchemaAdmin.pick(...detailFields)}
        model={property}
        onSubmit={handleSubmit(property._id)}
        className="form"
        layout={[
          {
            fields: [
              'houseType',
              'flatType',
              'investmentRent',
              'yearlyExpenses',
              'isNew',
              'isCoproperty',
              'copropertyPercentage',
            ],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: [
              'areaNorm',
              'insideArea',
              'landArea',
              'terraceArea',

              'gardenArea',
            ],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: [
              'numberOfFloors',
              'floorNumber',
              'roomCount',
              'bathroomCount',
              'parkingInside',
              'parkingOutside',
            ],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: ['volume', 'volumeNorm'],
            Component: Box,
            className: 'grid-col mb-32',
          },
          {
            fields: '__REST',
            className: 'grid-col',
          },
        ]}
      />
      {otherSchema._schemaKeys.length > 0 && (
        <>
          <h3>Autres</h3>
          <AutoForm
            schema={otherSchema}
            model={property}
            onSubmit={handleSubmit(property._id)}
            className="form"
            layout={[
              {
                fields: '__REST',
                className: 'grid-col',
              },
            ]}
          />
        </>
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
