// Rates and sources are documented in this google doc:
// https://docs.google.com/document/d/1EF373nmAZ7dZB22NELh-ffaaOwYkFCuTeQ5JrST5wUg

export const GE = {
  PROPERTY_REGISTRATION_TAX: 0.03,
  NOTARY_PROPERTY_BRACKETS_MIN: 200,
  NOTARY_PROPERTY_BRACKETS: [
    { rate: 0.007, max: 200000 },
    { rate: 0.006, max: 400000 },
    { rate: 0.0045, max: 800000 },
    { rate: 0.004, max: 1000000 },
    { rate: 0.0035, max: 1500000 },
    { rate: 0.003, max: 2000000 },
    { rate: 0.0025, max: 3500000 },
    { rate: 0.002, max: 5000000 },
    { rate: 0.0015, max: 7500000 },
    { rate: 0.001, max: 10000000 },
    { rate: 0.00075, max: 20000000 },
    { rate: 0.0005 },
  ],
  NOTARY_NOTE_BRACKETS_MIN: 100,
  NOTARY_NOTE_BRACKETS: [
    { rate: 0.005, max: 200000 },
    { rate: 0.004, max: 500000 },
    { rate: 0.003, max: 2000000 },
    { rate: 0.002, max: 5000000 },
    { rate: 0.001 },
  ],
  MORTGAGE_NOTE_REGISTRATION_TAX: 0.01365,
  LAND_REGISTRY_PROPERTY_TAX: 0.0025,
  LAND_REGISTRY_MORTGAGE_NOTE_TAX: 0.001,
  ADDITIONAL_FEES: 1000,
  CASATAX_CUTOFF: 1183649,
  CASATAX_PROPERTY_DEDUCTION: 17755,
  PROPERTY_CONSTRUCTION_TAX: 0.01,
};

export const VD = {
  PROPERTY_REGISTRATION_TAX: 0.033,
  NOTARY_PROPERTY_BRACKETS_MIN: 300,
  NOTARY_PROPERTY_BRACKETS: [
    { rate: 0.007, max: 100000 },
    { rate: 0.004, max: 300000 },
    { rate: 0.0025, max: 500000 },
    { rate: 0.002, max: 750000 },
    { rate: 0.0015, max: 2500000 },
    { rate: 0.001, max: 10000000 },
    { rate: 0.0005, max: 20000000 },
    { rate: 0.00025 },
  ],
  NOTARY_NOTE_BRACKETS_MIN: 100,
  NOTARY_NOTE_BRACKETS: [
    { rate: 0.005, max: 100000 },
    { rate: 0.0035, max: 300000 },
    { rate: 0.003, max: 500000 },
    { rate: 0.002, max: 750000 },
    { rate: 0.0015, max: 1000000 },
    { rate: 0.001, max: 5000000 },
    { rate: 0.0005, max: 10000000 },
    { rate: 0.00025, max: 20000000 },
    { rate: 0.000125 },
  ],
  LAND_REGISTRY_PROPERTY_TAX: 0.0015,
  LAND_REGISTRY_MORTGAGE_NOTE_TAX: 0.0035,
  ADDITIONAL_FEES: 1000,
};

// TODO: Complete
export const VS = {
  TRANSFER_TAX: 0.0225,
  NOTARY_PROPERTY_BRACKETS_MIN: 200,
  NOTARY_PROPERTY_BRACKETS: [
    { rate: 0.005, max: 200000 },
    { rate: 0.004, max: 500000 },
    { rate: 0.003, max: 1000000 },
    { rate: 0.002, max: 10000000 },
    { rate: 0.001 },
  ],
  NOTARY_NOTE_BRACKETS_MIN: 200,
  NOTARY_NOTE_BRACKETS: [
    { rate: 0.005, max: 100000 },
    { rate: 0.004, max: 200000 },
    { rate: 0.003, max: 500000 },
    { rate: 0.002, max: 1000000 },
    { rate: 0.001 },
  ],
};

// TODO: Complete
export const FR = {
  TRANSFER_TAX: 0.03,
};
