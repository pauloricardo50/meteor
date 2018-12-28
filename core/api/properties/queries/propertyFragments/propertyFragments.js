export const userValuation = {
  date: 1,
  error: 1,
  max: 1,
  microlocation: 1,
  min: 1,
  status: 1,
};

export const adminValuation = {
  ...userValuation,
  value: 1,
};

export const propertySummaryFragment = {
  address1: 1,
  address2: 1,
  canton: 1,
  city: 1,
  insideArea: 1,
  promotion: { name: 1 },
  propertyType: 1,
  status: 1,
  userId: 1,
  value: 1,
  zipCode: 1,
};
