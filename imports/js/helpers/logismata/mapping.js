import { getLocationId, callApi } from './api';
import { getLoanValue } from '../requestFunctions';

export const getLocation = (loanRequest, borrowers) => {
  let search = '';
  if (loanRequest.property.usageType === 'primary') {
    // use future property address
    search = `${loanRequest.property.zipCode.toString()} ${loanRequest.property
      .city}`;
  } else {
    // Use first borrower's current address
    search = `${borrowers[0].zipCode} ${borrowers[0].city}`;
  }

  return getLocationId(search);
};

export const getTaxBase = (loanRequest, borrowers, locationId) => ({
  locationId,
  currentYear: new Date().getFullYear(),
  civilStatus: borrowers[0].civilStatus,
  confession: 'other',
  // confession2: '',
  childrenCount: borrowers[0].childrenCount || 0,
  age: borrowers[0].age,
  sex: borrowers[0].sex,
  incomeBase: 'gross income',
  grossIncome: borrowers[0].salary,
  grossFortune: borrowers[0].bankFortune,
});

export const getMortgageArray = (loanRequest) => {
  const loanValue = getLoanValue(loanRequest);
  const propertyValue = loanRequest.property.value;
  const hasRank2 = loanValue / propertyValue > 0.65;

  const interestRate = 1.5;

  const defaultObject = {
    duration: 10,
    typ: 2, // fixed
    interestrate: interestRate,
  };

  const mortgages = [];
  mortgages.push({
    ...defaultObject,
    id: `${loanRequest.property.address1} 1`,
    description: 'rank 1',
    rang: 1,
    amount: hasRank2 ? 0.65 * propertyValue : loanValue,
  });

  if (hasRank2) {
    // If this project has a rank 2 mortgage
    mortgages.push({
      ...defaultObject,
      id: `${loanRequest.property.address1} 2`,
      description: 'rank 2',
      rang: 2,
      amount: loanValue - 0.65 * propertyValue,
    });
  }

  return mortgages;
};

export const getAmortizationObject = (loanRequest) => {
  const loanValue = getLoanValue(loanRequest);
  const propertyValue = loanRequest.property.value;

  // Very simple here, amortization goal is to reach 65%
  const goal = loanValue - 0.65 * propertyValue;

  return {
    amortizationGoal: goal,
    duration: 10,
    isDetailed: false,
    rentalValue: 0,
    maintenanceCosts: 0,
    newMortgages: true,
    mortgages: getMortgageArray(loanRequest),
    savingType: 'Saving 3a',
    savingRate: 0.01,
  };
};

export const calculateDirectAmo = (loanRequest, borrowers) => {
  console.log('calculating direct...');
  return getLocation(loanRequest, borrowers).then(locationId =>
    callApi('calcDirectAmortization', {
      taxBase: getTaxBase(loanRequest, borrowers, locationId),
      ...getAmortizationObject(loanRequest),
    }),
  );
};

export const calculateIndirectAmo = (loanRequest, borrowers) => {
  console.log('calculating direct...');

  return getLocation(loanRequest, borrowers).then(locationId =>
    callApi('calcIndirectAmortization', {
      taxBase: getTaxBase(loanRequest, borrowers, locationId),
      ...getAmortizationObject(loanRequest),
    }),
  );
};
