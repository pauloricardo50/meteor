import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { getFileSchema } from '../files/files';
import {
  PROPERTY_STATUS,
  USAGE_TYPE,
  PROPERTY_STYLE,
  VOLUME_NORM,
} from './propertyConstants';

const Properties = new Mongo.Collection('properties');

// Prevent all client side modifications of mongoDB
Properties.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
Properties.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

const PropertyFilesSchema = new SimpleSchema(getFileSchema('property'));

export const PropertySchema = new SimpleSchema({
  userId: {
    type: String,
    index: true,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isInsert || this.isUpdate) {
        return new Date();
      }
    },
  },
  status: {
    type: String,
    defaultValue: PROPERTY_STATUS.FOR_SALE,
    allowedValues: Object.values(PROPERTY_STATUS),
  },
  value: {
    // Cost of the property
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  propertyWork: {
    // Additional work on property
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  usageType: {
    type: String,
    defaultValue: USAGE_TYPE.PRIMARY,
    allowedValues: Object.values(USAGE_TYPE),
  },
  investmentRent: {
    // Rent of property if investment
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  style: {
    type: String,
    optional: true,
    defaultValue: PROPERTY_STYLE.FLAT,
    allowedValues: Object.values(PROPERTY_STYLE),
  },
  address: {
    // For condensed, google places addresses
    type: String,
    optional: true,
  },
  address1: {
    type: String,
    optional: true,
  },
  address2: {
    type: String,
    optional: true,
  },
  zipCode: {
    type: Number,
    optional: true,
    min: 1000,
    max: 9999,
  },
  city: {
    type: String,
    optional: true,
  },
  constructionYear: {
    type: Number,
    min: 0,
    max: 2030,
    optional: true,
  },
  renovationYear: {
    type: Number,
    min: 0,
    max: 2030,
    optional: true,
  },
  insideArea: {
    type: Number,
    optional: true,
    min: 0,
  },
  landArea: {
    type: Number,
    optional: true,
    min: 0,
  },
  balconyArea: {
    type: Number,
    optional: true,
    min: 0,
  },
  terraceArea: {
    type: Number,
    optional: true,
    min: 0,
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
  toiletCount: {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  volume: {
    type: Number,
    optional: true,
    min: 0,
    max: 5000,
  },
  volumeNorm: {
    type: String,
    defaultValue: VOLUME_NORM.SIA,
    allowedValues: Object.keys(VOLUME_NORM),
  },
  parking: {
    type: Object,
    defaultValue: {},
  },
  'parking.box': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  'parking.inside': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  'parking.outside': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  minergie: {
    type: Boolean,
    defaultValue: false,
  },
  isCoproperty: {
    type: Boolean,
    defaultValue: false,
  },
  isNew: {
    type: Boolean,
    defaultValue: false,
  },
  copropertyPercentage: {
    type: Number,
    min: 0,
    max: 1000,
    optional: true,
  },
  cityPlacementQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  buildingPlacementQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  buildingQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  flatQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  materialsQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  otherNotes: {
    type: String,
    optional: true,
  },
  pictures: {
    type: Array,
    optional: true,
  },
  name: {
    type: String,
    optional: true,
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
  nearestBusStation: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  nearestTrainStation: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  customFields: {
    // Allows storing custom fields that aren't allowed by the default schema
    type: Object,
    blackbox: true,
    defaultValue: {},
  },
  adminValidation: { type: Object, defaultValue: {}, blackbox: true },
  files: {
    type: PropertyFilesSchema,
    defaultValue: {},
  },
});

// Attach schema
Properties.attachSchema(PropertySchema);
export default Properties;
