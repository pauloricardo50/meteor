import { constants } from 'core/api';

const {
  PROPERTY_STYLE,
  PURCHASE_TYPE,
  OWNER,
  USAGE_TYPE,
  EXPERTISE_RATING,
} = constants;

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

const getPropertyArray = (loanRequest, borrowers) => {
  const r = loanRequest;

  if (!r) {
    throw new Error('requires a loanRequest');
  }

  const array = [
    { id: 'property.value', type: 'textInput', money: true },
    {
      id: 'property.propertyWork',
      type: 'textInput',
      money: true,
      required: false,
    },
    {
      id: 'property.usageType',
      type: 'radioInput',
      options: Object.values(USAGE_TYPE),
    },
    {
      id: 'property.style',
      type: 'radioInput',
      options: Object.values(PROPERTY_STYLE),
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
            .filter(value => (borrowers.length === 1 ? value !== OWNER.SECOND : true))
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
            .filter(value => (borrowers.length === 1 ? value !== OWNER.SECOND : true))
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
    {
      id: 'property.isNew',
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
      id: 'property.address1',
      type: 'textInput',
    },
    {
      id: 'property.address2',
      type: 'textInput',
      required: false,
    },
    {
      id: 'property.zipCode',
      type: 'custom',
      component: 'ZipAutoComplete',
      componentProps: {
        savePath: 'property.',
        initialValue:
          r.property.zipCode && r.property.city
            ? `${r.property.zipCode} ${r.property.city}`
            : '',
      },
    },
    {
      type: 'h3',
      id: 'propertyDetails',
      ignore: true,
      required: false,
    },
    { id: 'property.constructionYear', type: 'textInput', number: true },
    {
      id: 'property.renovationYear',
      type: 'textInput',
      number: true,
      required: false,
      info: true,
    },
    {
      id: 'property.landArea',
      type: 'textInput',
      number: true,
      condition: r.property.style === PROPERTY_STYLE.VILLA,
    },
    { id: 'property.insideArea', type: 'textInput', number: true },
    {
      id: 'property.balconyArea',
      type: 'textInput',
      number: true,
      required: false,
    },
    {
      id: 'property.terraceArea',
      type: 'textInput',
      number: true,
      required: false,
    },
    {
      id: 'property.volume',
      type: 'textInput',
      number: true,
      condition: r.property.style === PROPERTY_STYLE.VILLA,
    },
    {
      id: 'property.volumeNorm',
      type: 'textInput',
      condition: r.property.style === PROPERTY_STYLE.VILLA,
    },
    {
      id: 'property.roomCount',
      type: 'textInput',
      decimal: true,
      info: true,
    },
    {
      id: 'property.bathroomCount',
      type: 'textInput',
      number: true,
      info: true,
    },
    { id: 'property.toiletCount', type: 'textInput', number: true },
    { id: 'property.parking.box', type: 'textInput', number: true },
    { id: 'property.parking.inside', type: 'textInput', number: true },
    { id: 'property.parking.outside', type: 'textInput', number: true },
    { id: 'property.minergie', type: 'radioInput', options: [true, false] },
    {
      type: 'conditionalInput',
      conditionalTrueValue: true,
      condition: r.property.style === PROPERTY_STYLE.VILLA,
      inputs: [
        {
          id: 'property.isCoproperty',
          type: 'radioInput',
          options: [true, false],
        },
        {
          id: 'property.copropertyPercentage',
          type: 'textInput',
          number: true,
          info: true,
        },
      ],
    },
    {
      id: 'property.copropertyPercentage',
      type: 'textInput',
      number: true,
      condition: r.property.style === PROPERTY_STYLE.FLAT,
      info: true,
    },
    {
      type: 'h3',
      id: 'propertyQuality',
      ignore: true,
      required: false,
    },
    {
      id: 'property.cityPlacementQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
    },
    {
      id: 'property.buildingPlacementQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
      condition: r.property.style === PROPERTY_STYLE.FLAT,
    },
    {
      id: 'property.buildingQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
    },
    {
      id: 'property.flatQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
      condition: r.property.style === PROPERTY_STYLE.FLAT,
    },
    {
      id: 'property.materialsQuality',
      type: 'radioInput',
      options: Object.values(EXPERTISE_RATING),
    },
    {
      id: 'property.otherNotes',
      type: 'textInput',
      multiline: true,
      rows: 3,
      required: false,
    },
  ];

  return array.map(mapInput);
};

export default getPropertyArray;
