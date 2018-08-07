import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import {
  PROPERTIES_COLLECTION,
  PROPERTY_STATUS,
  RESIDENCE_TYPE,
  PROPERTY_TYPE,
  VOLUME_NORM,
  EXPERTISE_STATUS,
  MINERGIE_CERTIFICATE,
  HOUSE_TYPE,
  FLAT_TYPE,
  AREA_NORM,
} from './propertyConstants';

const Properties = new Mongo.Collection(PROPERTIES_COLLECTION);

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
    defaultValue: EXPERTISE_STATUS.NONE,
    allowedValues: Object.keys(EXPERTISE_STATUS),
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
  residenceType: {
    type: String,
    defaultValue: RESIDENCE_TYPE.MAIN,
    allowedValues: Object.values(RESIDENCE_TYPE),
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
    defaultValue: PROPERTY_TYPE.FLAT,
    allowedValues: Object.values(PROPERTY_TYPE),
  },
  houseType: {
    type: String,
    optional: true,
    defaultValue: HOUSE_TYPE.DETACHED,
    allowedValues: Object.values(HOUSE_TYPE),
  },
  flatType: {
    type: String,
    optional: true,
    defaultValue: FLAT_TYPE.SINGLE_FLOOR,
    allowedValues: Object.values(FLAT_TYPE),
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
    allowedValues: Object.values(AREA_NORM),
    defaultValue: AREA_NORM.NET,
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
    max: 5000,
  },
  volumeNorm: {
    type: String,
    defaultValue: VOLUME_NORM.SIA_416,
    allowedValues: Object.values(VOLUME_NORM),
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
    defaultValue: MINERGIE_CERTIFICATE.WITHOUT,
    allowedValues: Object.values(MINERGIE_CERTIFICATE),
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
});

// Attach schema
Properties.attachSchema(PropertySchema);
export default Properties;
