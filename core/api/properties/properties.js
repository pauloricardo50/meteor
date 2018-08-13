import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import * as propertyConstants from './propertyConstants';

const Properties = new Mongo.Collection(propertyConstants.PROPERTIES_COLLECTION);

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

export const MicrolocationFactorSchema = new SimpleSchema({
  grade: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  text: {
    type: String,
    optional: true,
  },
});

const MicrolocationFactor = {
  type: MicrolocationFactorSchema,
  optional: true,
};

export const MicrolocationSchema = new SimpleSchema({
  grade: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  factors: {
    type: Object,
    optional: true,
  },
  'factors.terrain': {
    type: Object,
    optional: true,
  },
  'factors.terrain.grade': {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  'factors.terrain.slopeInclination': MicrolocationFactor,
  'factors.terrain.exposition': MicrolocationFactor,
  'factors.terrain.sunShineDurationSummer': MicrolocationFactor,
  'factors.terrain.sunShineDurationWinter': MicrolocationFactor,
  'factors.terrain.lakeView': MicrolocationFactor,
  'factors.terrain.mountainView': MicrolocationFactor,
  'factors.infrastructure': {
    type: Object,
    optional: true,
  },
  'factors.infrastructure.grade': {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  'factors.infrastructure.distanceCenter': MicrolocationFactor,
  'factors.infrastructure.distanceSchool': MicrolocationFactor,
  'factors.infrastructure.distanceShopping': MicrolocationFactor,
  'factors.infrastructure.distanceBusStop': MicrolocationFactor,
  'factors.infrastructure.publicTransportGrade': MicrolocationFactor,
  'factors.infrastructure.distanceRecreationArea': MicrolocationFactor,
  'factors.infrastructure.distanceLake': MicrolocationFactor,
  'factors.infrastructure.distanceRiver': MicrolocationFactor,
  'factors.immission': {
    type: Object,
    optional: true,
  },
  'factors.immission.grade': {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  'factors.immission.immissionTrainDay': MicrolocationFactor,
  'factors.immission.immissionTrainNight': MicrolocationFactor,
  'factors.immission.immissionStreetDay': MicrolocationFactor,
  'factors.immission.immissionStreetNight': MicrolocationFactor,
  'factors.immission.distanceMainRoadResidential': MicrolocationFactor,
  'factors.immission.distanceRailway': MicrolocationFactor,
  'factors.immission.distanceRadioAntenna': MicrolocationFactor,
  'factors.immission.distanceNuclearPower': MicrolocationFactor,
  'factors.immission.distanceHighVoltagePowerLine': MicrolocationFactor,
});

export const ValuationSchema = new SimpleSchema({
  status: {
    type: String,
    defaultValue: propertyConstants.VALUATION_STATUS.NONE,
    allowedValues: Object.keys(propertyConstants.VALUATION_STATUS),
  },
  min: {
    type: Number,
    min: 0,
    optional: true,
  },
  max: {
    type: Number,
    min: 0,
    optional: true,
  },
  value: {
    type: Number,
    min: 0,
    optional: true,
  },
  date: {
    type: Date,
    optional: true,
  },
  error: {
    type: String,
    optional: true,
  },
  microlocation: {
    type: MicrolocationSchema,
    optional: true,
  },
});

export const PropertySchema = new SimpleSchema({
  userId: {
    type: String,
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
    defaultValue: propertyConstants.PROPERTY_STATUS.FOR_SALE,
    allowedValues: Object.values(propertyConstants.PROPERTY_STATUS),
  },
  value: {
    // Cost of the property
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  residenceType: {
    type: String,
    defaultValue: propertyConstants.RESIDENCE_TYPE.MAIN_RESIDENCE,
    allowedValues: Object.values(propertyConstants.RESIDENCE_TYPE),
  },
  investmentRent: {
    // Rent of property if investment
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
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
  areaNorm: {
    type: String,
    optional: true,
    allowedValues: Object.values(propertyConstants.AREA_NORM),
    defaultValue: propertyConstants.AREA_NORM.NIA,
  },
  landArea: {
    type: Number,
    optional: true,
    min: 0,
  },
  terraceArea: {
    type: Number,
    optional: true,
    min: 0,
  },
  numberOfFloors: {
    type: Number,
    optional: true,
    min: 0,
    max: 20,
  },
  floorNumber: {
    type: Number,
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
  volume: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000,
  },
  volumeNorm: {
    type: String,
    defaultValue: propertyConstants.VOLUME_NORM.SIA_416,
    allowedValues: Object.values(propertyConstants.VOLUME_NORM),
  },
  parking: {
    type: Object,
    defaultValue: {},
  },
  'parking.inside': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
    defaultValue: 0,
  },
  'parking.outside': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
    defaultValue: 0,
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
  customFields: {
    // Allows storing custom fields that aren't allowed by the default schema
    type: Object,
    blackbox: true,
    defaultValue: {},
  },
  qualityProfile: {
    type: Object,
    optional: true,
    defaultValue: {},
  },
  'qualityProfile.condition': {
    type: String,
    optional: true,
    allowedValues: Object.values(propertyConstants.QUALITY.CONDITION),
    defaultValue: propertyConstants.QUALITY.CONDITION.INTACT,
  },
  'qualityProfile.standard': {
    type: String,
    optional: true,
    allowedValues: Object.values(propertyConstants.QUALITY.STANDARD),
    defaultValue: propertyConstants.QUALITY.STANDARD.AVERAGE,
  },
  valuation: {
    type: ValuationSchema,
    defaultValue: {},
  },
  adminValidation: { type: Object, defaultValue: {}, blackbox: true },
  documents: {
    type: Object,
    defaultValue: {},
    blackbox: true,
  },
  monthlyExpenses: {
    type: Number,
    min: 0,
    max: 100000,
    optional: true,
  },
});

// Attach schema
Properties.attachSchema(PropertySchema);
export default Properties;
