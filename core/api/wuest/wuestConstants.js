export const TOKEN =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3ZWJzZXJ2aWNlLmUtcG90ZWsiLCJleHAiOjE1OTMyOTUyMDAsImp0aSI6IjM3In0.pEQ2g-S1gEJ3rCCQV8YmR6cj2BYcqDxpmjDMYet5jgSGWmNp6KbomeyfrIPdrLRDJCu96fNsUyE5XmFgpr-eMg';

export const URL =
  'https://www.wuestdimensions.com/ws/calculator/valuation?expand=keyFigureExtension,qualityProfile,valueCorrections';

export const PROPERTY_TYPE = {
  HOUSE: 'HOUSE',
  FLAT: 'FLAT',
};
export const HED_METHOD = {
  SFH: 'HED_SFH',
  CON: 'HED_CON',
};

export const RESIDENCE_TYPE = {
  MAIN: 'MAIN_RESIDENCE',
  SECOND: 'SECOND_RESIDENCE',
};

export const MINERGIE_CERTIFICATE = {
  WITHOUT: 'WITHOUT_CERTIFICATE',
  P: 'MINERGIE_P',
  ECO: 'MINERGIE_ECO',
  P_ECO: 'MINERGIE_P_ECO',
  OTHER: 'OTHER_CERTIFICATE',
};

export const HOUSE_TYPE = {
  DETACHED: 'DETACHED',
  ATTACHED_END: 'ATTACHED_END_BUILDING',
  ATTACHED_MID: 'ATTACHED_MID_TERRACE_BUILDING',
};

export const FLAT_TYPE = {
  SINGLE_FLOOR: 'SINGLE_FLOOR_APARTMENT',
  DUPLEX: 'DUPLEX_APARTMENT',
  PENTHOUSE: 'PENTHOUSE_APARTMENT',
  PENTHOUSE_DUPLEX: 'PENTHOUSE_MAISONETTE',
  GROUND_FLOOR: 'TERRACE_APARTMENT',
};

// TODO: check size of array
export const FLOOR_NUMBER = [
  'GROUND_FLOOR',
  'FIRST_FLOOR',
  'SECOND_FLOOR',
  'THIRD_FLOOR',
  'FOURTH_FLOOR',
  'FIFTH_FLOOR',
  'SIXTH_FLOOR',
  'SEVENTH_FLOOR',
  'EIGHTH_FLOOR',
  'NINTH_FLOOR',
  'TENTH_FLOOR',
  'ELEVENTH_FLOOR',
  'TWELVTH_FLOOR',
  'THIRTEENTH_FLOOR',
  'FOURTEETNH_FLOOR',
  'FIFTEENTH_FLOOR',
  'SIXTEENTH_FLOOR',
  'SEVENTEENTH_FLOOR',
  'EIGHTEENTH_FLOOR',
  'NINETEENTH_FLOOR',
  'TWENTIETH_FLOOR',
];

export const VOLUME_TYPE = {
  SIA_416: 'SIA_416',
  SIA_116: 'SIA_116',
  BIC: 'BIC',
};

export const AREA_TYPE = {
  NET: 'NIA',
  GROSS: 'NLS',
};

export const QUALITY = {
  CONDITION: {
    NEEDS_RENNOVATION: 1,
    INTACT: 3,
    EXCELLENT: 5,
  },
  STANDARD: {
    UNSATISFACTORY: 1,
    AVERAGE: 3,
    HIGH: 4.5,
  },
  SITUATION: {
    BAD: 1.5,
    AVERAGE: 2,
    GOOD: 4,
  },
};

export const JSON_DATA_STRUCTURE = {
  embedded: [
    {
      rel: 'valueCorrections',
    },
    {
      rel: 'objectData',
      value: {
        embedded: [
          {
            rel: 'buildings',
          },
        ],
      },
    },
    {
      rel: 'qualityProfile',
    },
  ],
};

export const ERRORS = {
  NO_PROPERTY_FOUND: 'NO_PROPERTY_FOUND',
};
