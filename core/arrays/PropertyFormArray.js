import {
  PROPERTY_STYLE,
  PURCHASE_TYPE,
  OWNER,
  USAGE_TYPE,
  EXPERTISE_RATING,
} from 'core/api/constants';

const mapInput = (input) => {
  const intlSafeObject = { ...input };
  // If the id contains a dot in it, split it and add a intlId
  // This makes it easier to write intl messages
  if (input.id && input.id.indexOf('.') > 0) {
    // Perform some additional slicing to make sure ids with multiple dots
    // work by removing only the first part
    intlSafeObject.intlId = input.id
      .split('.')
      .slice(1)
      .join('.');
  }

  if (input.inputs) {
    // If there are nested inputs, give them an intlId too
    intlSafeObject.inputs = input.inputs.map(obj =>
      (obj.id && obj.id.indexOf('.') > 0
        ? { ...obj, intlId: obj.id.split('.')[1] }
        : obj));
  }

  return intlSafeObject;
};

export const getPropertyLoanArray = ({ loan, borrowers }) => {
  const r = loan;

  if (!r) {
    throw new Error('requires a loan');
  }

  const array = [
    {
      type: 'h3',
      id: 'propertyInfo',
      ignore: true,
      required: false,
    },
    {
      id: 'general.usageType',
      type: 'radioInput',
      options: Object.values(USAGE_TYPE),
    },
    {
      id: 'general.propertyWork',
      type: 'textInput',
      money: true,
      required: false,
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: OWNER.OTHER,
      condition:
        borrowers.length > 1 &&
        r.general.purchaseType === PURCHASE_TYPE.REFINANCING,
      inputs: [
        {
          id: 'general.currentOwner',
          type: 'radioInput',
          options: Object.values(OWNER)
            .filter(value => (borrowers.length === 1 ? value !== OWNER.SECOND : true), )
            .map((value) => {
              const isFirst = value === OWNER.FIRST;
              const isSecond = value === OWNER.SECOND;
              return isFirst || isSecond
                ? {
                  id: isFirst ? 0 : 1,
                  intlValues: {
                    name:
                        borrowers[isFirst ? 0 : 1].firstName ||
                        `Emprunteur ${isFirst ? 1 : 2}`,
                  },
                }
                : value;
            }),
        },
        { id: 'general.otherOwner', type: 'textInput' },
      ],
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: OWNER.OTHER,
      condition:
        borrowers.length > 1 &&
        r.general.purchaseType !== PURCHASE_TYPE.REFINANCING,
      inputs: [
        {
          id: 'general.futureOwner',
          type: 'radioInput',
          options: Object.values(OWNER)
            .filter(value => (borrowers.length === 1 ? value !== OWNER.SECOND : true), )
            .map((value) => {
              const isFirst = value === OWNER.FIRST;
              const isSecond = value === OWNER.SECOND;
              return isFirst || isSecond
                ? {
                  id: isFirst ? 0 : 1,
                  intlValues: {
                    name:
                        borrowers[isFirst ? 0 : 1].firstName ||
                        `Emprunteur ${isFirst ? 1 : 2}`,
                  },
                }
                : value;
            }),
        },
        {
          id: 'general.otherOwner',
          type: 'textInput',
        },
      ],
    },
  ];

  return array.map(mapInput);
};

export const getPropertyArray = ({ loan, borrowers, property }) => {
  const r = loan;

  if (!r) {
    throw new Error('requires a loan');
  }

  const array = [
    { id: 'value', type: 'textInput', money: true },
    {
      id: 'style',
      type: 'radioInput',
      options: Object.values(PROPERTY_STYLE),
    },
    {
      id: 'isNew',
      type: 'radioInput',
      options: [true, false],
      condition: r.general.purchaseType === PURCHASE_TYPE.ACQUISITION,
    },
    {
      type: 'h3',
      id: 'propertyAddress',
      ignore: true,
      required: false,
    },
    {
      id: 'address1',
      type: 'textInput',
    },
    {
      id: 'address2',
      type: 'textInput',
      required: false,
    },
    {
      id: 'zipCode',
      type: 'custom',
      component: 'ZipAutoComplete',
      componentProps: {
        savePath: '',
        initialValue:
          property.zipCode && property.city
            ? `${property.zipCode} ${property.city}`
            : '',
      },
    },
    {
      type: 'h3',
      id: 'propertyDetails',
      ignore: true,
      required: false,
    },
    { id: 'constructionYear', type: 'textInput', number: true },
    {
      id: 'renovationYear',
      type: 'textInput',
      number: true,
      required: false,
      info: true,
    },
    {
      id: 'landArea',
      type: 'textInput',
      number: true,
      condition: property.style === PROPERTY_STYLE.VILLA,
    },
    { id: 'insideArea', type: 'textInput', number: true },
    {
      id: 'balconyArea',
      type: 'textInput',
      number: true,
      required: false,
    },
    {
      id: 'terraceArea',
      type: 'textInput',
      number: true,
      required: false,
    },
    {
      id: 'volume',
      type: 'textInput',
      number: true,
      condition: property.style === PROPERTY_STYLE.VILLA,
    },
    {
      id: 'volumeNorm',
      type: 'textInput',
      condition: property.style === PROPERTY_STYLE.VILLA,
    },
    {
      id: 'roomCount',
      type: 'textInput',
      decimal: true,
      info: true,
    },
    {
      id: 'bathroomCount',
      type: 'textInput',
      number: true,
      info: true,
    },
    { id: 'toiletCount', type: 'textInput', number: true },
    { id: 'parking.box', type: 'textInput', number: true },
    { id: 'parking.inside', type: 'textInput', number: true },
    { id: 'parking.outside', type: 'textInput', number: true },
    { id: 'minergie', type: 'radioInput', options: [true, false] },
    {
      type: 'conditionalInput',
      conditionalTrueValue: true,
      condition: property.style === PROPERTY_STYLE.VILLA,
      inputs: [
        {
          id: 'isCoproperty',
          type: 'radioInput',
          options: [true, false],
        },
        {
          id: 'copropertyPercentage',
          type: 'textInput',
          number: true,
          info: true,
        },
      ],
    },
    {
      id: 'copropertyPercentage',
      type: 'textInput',
      number: true,
      condition: property.style === PROPERTY_STYLE.FLAT,
      info: true,
    },
    {
      type: 'h3',
      id: 'propertyQuality',
      ignore: true,
      required: false,
    },
    {
      id: 'cityPlacementQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
    },
    {
      id: 'buildingPlacementQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
      condition: property.style === PROPERTY_STYLE.FLAT,
    },
    {
      id: 'buildingQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
    },
    {
      id: 'flatQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
      condition: property.style === PROPERTY_STYLE.FLAT,
    },
    {
      id: 'materialsQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
    },
    {
      id: 'otherNotes',
      type: 'textInput',
      multiline: true,
      rows: 3,
      required: false,
    },
  ];

  return array.map(mapInput);
};
