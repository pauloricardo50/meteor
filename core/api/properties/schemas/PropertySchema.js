import SimpleSchema from 'simpl-schema';

import {
  createdAt,
  updatedAt,
  additionalDocuments,
  address,
  mortgageNoteLinks,
  roundedInteger,
} from '../../helpers/sharedSchemas';
import * as propertyConstants from '../propertyConstants';
import { initialDocuments } from '../propertiesAdditionalDocuments';
import { ValuationSchema } from './wuestSchemas';

export const PropertySchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  createdAt,
  updatedAt,
  name: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
  category: {
    type: String,
    optional: true,
    defaultValue: propertyConstants.PROPERTY_CATEGORY.USER,
    allowedValues: Object.values(propertyConstants.PROPERTY_CATEGORY),
  },
  // Cost of the property
  value: roundedInteger(3),
  status: {
    type: String,
    defaultValue: propertyConstants.PROPERTY_STATUS.FOR_SALE,
    allowedValues: Object.values(propertyConstants.PROPERTY_STATUS),
  },
  propertyType: {
    type: String,
    optional: true,
    defaultValue: propertyConstants.PROPERTY_TYPE.FLAT,
    allowedValues: Object.values(propertyConstants.PROPERTY_TYPE),
  },
  houseType: {
    type: String,
    optional: true,
    defaultValue: propertyConstants.HOUSE_TYPE.DETACHED,
    allowedValues: Object.values(propertyConstants.HOUSE_TYPE),
  },
  flatType: {
    type: String,
    optional: true,
    defaultValue: propertyConstants.FLAT_TYPE.SINGLE_FLOOR_APARTMENT,
    allowedValues: Object.values(propertyConstants.FLAT_TYPE),
  },
  investmentRent: {
    // Rent of property if investment
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 100000000,
  },
  ...address,
  constructionYear: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 2030,
    optional: true,
  },
  renovationYear: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 2030,
    optional: true,
  },
  insideArea: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
  },
  areaNorm: {
    type: String,
    optional: true,
    allowedValues: Object.values(propertyConstants.AREA_NORM),
    defaultValue: propertyConstants.AREA_NORM.NIA,
  },
  landArea: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
  },
  terraceArea: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
  },
  gardenArea: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
  },
  numberOfFloors: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 20,
  },
  floorNumber: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 20,
  },
  roomCount: {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  bathroomCount: {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  volume: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 100000,
  },
  volumeNorm: {
    type: String,
    defaultValue: propertyConstants.VOLUME_NORM.SIA_416,
    allowedValues: Object.values(propertyConstants.VOLUME_NORM),
  },
  parkingInside: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 100,
  },
  parkingOutside: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 100,
  },
  minergie: {
    type: String,
    defaultValue: propertyConstants.MINERGIE_CERTIFICATE.WITHOUT_CERTIFICATE,
    allowedValues: Object.values(propertyConstants.MINERGIE_CERTIFICATE),
  },
  isCoproperty: {
    type: Boolean,
    defaultValue: false,
  },
  copropertyPercentage: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 1000,
    optional: true,
  },
  isNew: {
    type: Boolean,
    defaultValue: false,
  },
  latitude: {
    type: Number,
    optional: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    optional: true,
    min: -180,
    max: 180,
  },
  customFields: {
    // Allows storing custom fields that aren't allowed by the default schema
    type: Object,
    blackbox: true,
    defaultValue: {},
  },
  qualityProfileCondition: {
    type: String,
    optional: true,
    allowedValues: Object.values(propertyConstants.QUALITY.CONDITION),
  },
  qualityProfileStandard: {
    type: String,
    optional: true,
    allowedValues: Object.values(propertyConstants.QUALITY.STANDARD),
  },
  valuation: {
    type: ValuationSchema,
    defaultValue: {},
  },
  adminValidation: { type: Object, defaultValue: {}, blackbox: true },
  monthlyExpenses: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 1000000,
    optional: true,
  },
  landValue: roundedInteger(3),
  constructionValue: roundedInteger(3),
  ...additionalDocuments(initialDocuments),
  ...mortgageNoteLinks,
});

const protectedKeys = [
  '_id',
  'additionalDocuments',
  'address',
  'adminValidation',
  'createdAt',
  'customFields',
  'latitude',
  'longitude',
  'updatedAt',
  'userId',
  'valuation',
];
export const PropertySchemaAdmin = PropertySchema.omit(...protectedKeys);
export default PropertySchema;
