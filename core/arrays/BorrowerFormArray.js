import * as constants from 'core/api/constants';

export const getBorrowerInfoArray = ({ borrowers, borrowerId: id }) => {
  const b = borrowers.find(borrower => borrower._id === id);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === id;

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  const disableAddress = !!b.sameAddress && !isFirst;

  return [
    { id: 'firstName', type: 'textInput' },
    { id: 'lastName', type: 'textInput' },
    {
      id: 'gender',
      type: 'radioInput',
      options: Object.values(constants.GENDER),
    },
    {
      type: 'h3',
      id: 'yourAddress',
      ignore: true,
      required: false,
    },
    {
      id: 'sameAddress',
      type: 'radioInput',
      intlValues: { name: borrowers[0].firstName || 'Emprunteur 1' },
      options: [true, false],
      condition: multiple && !isFirst,
    },
    {
      id: 'address1',
      type: 'textInput',
      condition: !disableAddress,
      placeholder: disableAddress && borrowers[0].address1,
      noIntl: disableAddress,
      required: !disableAddress,
    },
    {
      id: 'address2',
      type: 'textInput',
      condition: !disableAddress,
      required: false,
      placeholder: disableAddress && borrowers[0].address2,
      noIntl: disableAddress,
    },
    {
      id: 'zipCode',
      type: 'custom',
      component: 'ZipAutoComplete',
      componentProps: {
        savePath: '',
        initialValue: b.zipCode && b.city ? `${b.zipCode} ${b.city}` : '',
      },
      condition: !disableAddress,
      placeholder:
        disableAddress &&
        (borrowers[0].zipCode && borrowers[0].city
          ? `${borrowers[0].zipCode} ${borrowers[0].city}`
          : ''),
      noIntl: disableAddress,
      required: !disableAddress,
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: false,
      inputs: [
        {
          id: 'isSwiss',
          type: 'radioInput',
          options: [true, false],
        },
        {
          id: 'residencyPermit',
          type: 'selectFieldInput',
          options: Object.values(constants.RESIDENCY_PERMIT),
        },
      ],
    },
    {
      id: 'age',
      type: 'textInput',
      number: true,
      saveOnChange: false,
    },
    { id: 'birthPlace', type: 'textInput', condition: !!b.isSwiss },
    { id: 'citizenship', type: 'textInput', condition: !b.isSwiss },
    { id: 'isUSPerson', type: 'radioInput', options: [true, false] },
    {
      id: 'civilStatus',
      type: 'radioInput',
      options: Object.values(constants.CIVIL_STATUS).map(value => ({
        id: value,
        intlValues: { gender: b.gender },
      })),
    },
    { id: 'childrenCount', type: 'textInput', number: true },
    {
      id: 'company',
      type: 'textInput',
      required: false,
      autoComplete: 'organization',
    },
    {
      id: 'worksForOwnCompany',
      type: 'radioInput',
      options: [true, false],
    },
    { id: 'personalBank', type: 'textInput' },
  ];
};

export const getBorrowerFinanceArray = ({ borrowers, borrowerId: id }) => {
  const b = borrowers.find(borr => borr._id === id);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === id;

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  const incomeArray = [
    {
      type: 'h3',
      id: 'incomeAndExpenses',
      ignore: true,
      required: false,
    },
    { id: 'salary', type: 'textInput', money: true },
    {
      type: 'conditionalInput',
      conditionalTrueValue: true,
      inputs: [
        {
          id: 'bonusExists',
          type: 'radioInput',
          options: [true, false],
        },
        ...[2017, 2016, 2015, 2014].map(year => ({
          id: `bonus.bonus${year}`,
          type: 'textInput',
          money: true,
        })),
      ],
    },
    {
      id: 'expenses',
      type: 'arrayInput',
      required: false,
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          options: Object.values(constants.EXPENSES),
        },
        { id: 'value', type: 'textInput', money: true },
      ],
    },
    {
      id: 'otherIncome',
      type: 'arrayInput',
      required: false,
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          options: Object.values(constants.OTHER_INCOME),
        },
        { id: 'value', type: 'textInput', money: true },
      ],
    },
  ];

  const fortuneArray = [
    {
      type: 'h3',
      id: 'fortune',
      ignore: true,
      required: false,
    },
    {
      id: 'bankFortune',
      type: 'textInput',
      money: true,
    },
    {
      id: 'realEstate',
      type: 'arrayInput',
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          options: Object.values(constants.REAL_ESTATE),
        },
        {
          id: 'value',
          type: 'textInput',
          money: true,
        },
        {
          id: 'loan',
          type: 'textInput',
          money: true,
        },
      ],
    },
    {
      id: 'otherFortune',
      type: 'arrayInput',
      required: false,
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          options: Object.values(constants.OTHER_FORTUNE),
        },
        {
          id: 'value',
          type: 'textInput',
          money: true,
        },
      ],
    },
  ];

  const insuranceArray = [
    {
      type: 'h3',
      id: 'insurance',
      required: false,
      ignore: true,
    },
    {
      id: 'insuranceSecondPillar',
      type: 'textInput',
      money: true,
      required: false,
    },
    {
      id: 'insuranceThirdPillar',
      type: 'textInput',
      money: true,
      required: false,
    },
    {
      id: 'insurance3B',
      type: 'textInput',
      money: true,
      required: false,
    },
    {
      id: 'insurancePureRisk',
      type: 'textInput',
      money: true,
      required: false,
    },
  ];

  return incomeArray.concat([...fortuneArray, ...insuranceArray]);
};
