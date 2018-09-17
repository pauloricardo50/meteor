// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import omit from 'lodash/omit';

import { PropertySchemaAdmin } from 'core/api/properties/properties';
import { propertyUpdate } from 'core/api';
import AutoField from './AutoField';

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
  'minergie',
  'isCoproperty',
  'isNew',
  'copropertyPercentage',
  'qualityProfileCondition',
  'qualityProfileStandard',
  'monthlyExpenses',
];

const grapherLinks = ['loans', 'user', 'documents'];

const otherSchema = PropertySchemaAdmin.omit(...baseFields, ...detailFields);

const BorrowerForm = ({ property }: BorrowerFormProps) => (
  <div className="property-admin-form">
    <div>
      <h3>Informations de base</h3>
      <AutoForm
        schema={PropertySchemaAdmin.pick(...baseFields)}
        model={property}
        onSubmit={doc =>
          propertyUpdate.run({
            propertyId: property._id,
            object: omit(doc, grapherLinks),
          })
        }
        className="form"
        autoField={AutoField}
      />
    </div>
    <div>
      <h3>État du bien</h3>
      <AutoForm
        schema={PropertySchemaAdmin.pick(...detailFields)}
        model={property}
        onSubmit={doc =>
          propertyUpdate.run({
            propertyId: property._id,
            object: omit(doc, grapherLinks),
          })
        }
        className="form"
        autoField={AutoField}
      />
    </div>
    {otherSchema._schemaKeys.length > 0 && (
      <div>
        <h3>Autres</h3>
        <AutoForm
          schema={otherSchema}
          model={property}
          onSubmit={doc =>
            propertyUpdate.run({
              propertyId: property._id,
              object: omit(doc, grapherLinks),
            })
          }
          className="form"
          autoField={AutoField}
        />
      </div>
    )}
  </div>
);

export default BorrowerForm;
