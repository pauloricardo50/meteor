import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const propertyInsert = new Method({
  name: 'propertyInsert',
  params: {
    property: Object,
    userId: Match.Optional(String),
    loanId: Match.Optional(String),
  },
});

export const propertyUpdate = new Method({
  name: 'propertyUpdate',
  params: {
    propertyId: String,
    object: Object,
  },
});

export const propertyDelete = new Method({
  name: 'propertyDelete',
  params: {
    propertyId: String,
  },
});

export const pushPropertyValue = new Method({
  name: 'pushPropertyValue',
  params: {
    propertyId: String,
    object: Object,
  },
});

export const popPropertyValue = new Method({
  name: 'popPropertyValue',
  params: {
    propertyId: String,
    object: Object,
  },
});

export const pullPropertyValue = new Method({
  name: 'pullPropertyValue',
  params: {
    propertyId: String,
    object: Object,
  },
});

export const evaluateProperty = new Method({
  name: 'evaluateProperty',
  params: {
    propertyId: String,
    loanResidenceType: String,
  },
});

export const propertyDataIsInvalid = new Method({
  name: 'propertyDataIsInvalid',
  params: {
    propertyId: String,
    loanResidenceType: Match.Optional(String),
  },
});

export const inviteUserToProperty = new Method({
  name: 'inviteUserToProperty',
  params: { user: Object, propertyId: String },
});

export const addProUserToProperty = new Method({
  name: 'addProUserToProperty',
  params: { propertyId: String, userId: String },
});

export const proPropertyInsert = new Method({
  name: 'proPropertyInsert',
  params: { userId: String, property: Object },
});

export const setProPropertyPermissions = new Method({
  name: 'setProPropertyPermissions',
  params: { propertyId: String, userId: String, permissions: Object },
});
