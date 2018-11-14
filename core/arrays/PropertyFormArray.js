import {
  PROPERTY_TYPE,
  PURCHASE_TYPE,
  OWNER,
  RESIDENCE_TYPE,
  MINERGIE_CERTIFICATE,
  HOUSE_TYPE,
  FLAT_TYPE,
  VOLUME_NORM,
  AREA_NORM,
} from 'core/api/constants';
import { QUALITY } from '../api/constants';

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
      id: 'general.residenceType',
      type: 'radioInput',
      options: Object.values(RESIDENCE_TYPE),
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: OWNER.OTHER,
      condition:
        borrowers.length > 1 && r.purchaseType === PURCHASE_TYPE.REFINANCING,
      inputs: [
        {
          id: 'currentOwner',
          type: 'radioInput',
          options: Object.values(OWNER)
            .filter(value =>
              (borrowers.length === 1 ? value !== OWNER.SECOND : true))
            .map((value) => {
              const isFirst = value === OWNER.FIRST;
              const isSecond = value === OWNER.SECOND;
              return isFirst || isSecond
                ? {
                  id: isFirst ? 0 : 1,
                  intlValues: {
                    name:
                        borrowers[isFirst ? 0 : 1].firstName
                        || `Emprunteur ${isFirst ? 1 : 2}`,
                  },
                }
                : value;
            }),
        },
        { id: 'otherOwner', type: 'textInput' },
      ],
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: OWNER.OTHER,
      condition:
        borrowers.length > 1 && r.purchaseType !== PURCHASE_TYPE.REFINANCING,
      inputs: [
        {
          id: 'futureOwner',
          type: 'radioInput',
          options: Object.values(OWNER)
            .filter(value =>
              (borrowers.length === 1 ? value !== OWNER.SECOND : true))
            .map((value) => {
              const isFirst = value === OWNER.FIRST;
              const isSecond = value === OWNER.SECOND;
              return isFirst || isSecond
                ? {
                  id: isFirst ? 0 : 1,
                  intlValues: {
                    name:
                        borrowers[isFirst ? 0 : 1].firstName
                        || `Emprunteur ${isFirst ? 1 : 2}`,
                  },
                }
                : value;
            }),
        },
        {
          id: 'otherOwner',
          type: 'textInput',
        },
      ],
    },
  ];

  return array.map(mapInput);
};

const shouldDisplayFloorNumber = ({ propertyType, flatType }) =>
  propertyType === PROPERTY_TYPE.FLAT
  && flatType !== FLAT_TYPE.PENTHOUSE_APARTMENT
  && flatType !== FLAT_TYPE.PENTHOUSE_MAISONETTE
  && flatType !== FLAT_TYPE.TERRACE_APARTMENT;

const shouldDisplayTerraceArea = ({ propertyType, flatType }) =>
  propertyType === PROPERTY_TYPE.FLAT
  && flatType === FLAT_TYPE.TERRACE_APARTMENT;

export const getPropertyArray = ({ loan, borrowers, property }) => {
  const r = loan;

  if (!r) {
    throw new Error('requires a loan');
  }

  const array = [
    { id: 'value', type: 'textInput', money: true, info: true },
    {
      id: 'propertyType',
      type: 'radioInput',
      options: Object.values(PROPERTY_TYPE),
    },
    {
      id: 'isNew',
      type: 'radioInput',
      options: [true, false],
      condition: r.purchaseType === PURCHASE_TYPE.ACQUISITION,
    },
    {
      id: 'isCoproperty',
      type: 'radioInput',
      options: [true, false],
    },
    {
      id: 'copropertyPercentage',
      type: 'textInput',
      condition: property.isCoproperty,
      info: true,
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
      id: 'city',
      type: 'textInput',
    },
    {
      id: 'zipCode',
      type: 'textInput',
    },
    // {
    //   id: 'zipCode',
    //   type: 'custom',
    //   component: 'ZipAutoComplete',
    //   componentProps: {
    //     savePath: '',
    //     initialValue:
    //       property.zipCode && property.city
    //         ? `${property.zipCode} ${property.city}`
    //         : '',
    //   },
    // },
    {
      type: 'h3',
      id: 'propertyDetails',
      ignore: true,
      required: false,
    },
    {
      id: 'houseType',
      type: 'radioInput',
      options: Object.values(HOUSE_TYPE),
      condition: property.propertyType === PROPERTY_TYPE.HOUSE,
    },
    {
      id: 'flatType',
      type: 'radioInput',
      options: Object.values(FLAT_TYPE),
      condition: property.propertyType === PROPERTY_TYPE.FLAT,
    },
    {
      id: 'numberOfFloors',
      type: 'textInput',
      number: true,
      condition: property.propertyType === PROPERTY_TYPE.FLAT,
    },
    {
      id: 'floorNumber',
      type: 'textInput',
      number: true,
      condition: shouldDisplayFloorNumber(property),
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
      condition: property.propertyType === PROPERTY_TYPE.HOUSE,
    },
    {
      id: 'insideArea',
      type: 'textInput',
      number: true,
      condition: property.propertyType === PROPERTY_TYPE.FLAT,
    },
    {
      id: 'terraceArea',
      type: 'textInput',
      number: true,
      required: true,
      condition: shouldDisplayTerraceArea(property),
    },
    {
      id: 'volume',
      type: 'textInput',
      number: true,
      condition: property.propertyType === PROPERTY_TYPE.HOUSE,
    },
    {
      id: 'volumeNorm',
      type: 'radioInput',
      options: Object.values(VOLUME_NORM),
      condition: property.propertyType === PROPERTY_TYPE.HOUSE,
    },
    {
      id: 'roomCount',
      type: 'textInput',
      decimal: true,
      info: true,
    },
    { id: 'parkingInside', type: 'textInput', number: true, required: false },
    { id: 'parkingOutside', type: 'textInput', number: true, required: false },
    {
      id: 'minergie',
      type: 'radioInput',
      options: Object.values(MINERGIE_CERTIFICATE),
    },
    {
      id: 'monthlyExpenses',
      type: 'textInput',
      money: true,
      required: false,
      info: true,
    },
    {
      type: 'h3',
      id: 'propertyQuality',
      ignore: true,
      required: false,
    },
    {
      id: 'qualityProfileCondition',
      type: 'radioInput',
      options: Object.values(QUALITY.CONDITION),
    },
    {
      id: 'qualityProfileStandard',
      type: 'radioInput',
      options: Object.values(QUALITY.STANDARD),
    },
  ];

  return array.map(mapInput);
};
