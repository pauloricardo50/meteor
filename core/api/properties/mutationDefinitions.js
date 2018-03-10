export const PROPERTY_INSERT = {
  name: 'PROPERTY_INSERT',
  params: {
    property: { type: Object },
    userId: { type: String, optional: true },
  },
};

export const PROPERTY_UPDATE = {
  name: 'PROPERTY_UPDATE',
  params: {
    propertyId: { type: String },
    property: { type: Object },
  },
};

export const PROPERTY_DELETE = {
  name: 'PROPERTY_DELETE',
  params: {
    propertyId: { type: String },
  },
};
