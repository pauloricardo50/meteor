import cleanMethod from 'core/api/cleanMethods';

// The final function that inserts the documents once the form is finished
const saveStartForm = (f, userId) => {
  const multiple = f.borrowerCount > 1;
  const borrowerOne = {
    age: f.age,
    gender: f.gender,
    salary: f.income1,
    bonusExists: f.bonusExists,
    bonus: {
      bonus2014: f.bonus11,
      bonus2015: f.bonus21,
      bonus2016: f.bonus31,
      bonus2017: f.bonus41,
    },
    otherIncome: f.otherIncome || [],
    expenses: f.expenses || [],
    realEstate: f.realEstate || [],
    bankFortune: f.fortune1,
    insuranceSecondPillar: f.insurance11,
    insuranceThirdPillar: f.insurance21,
  };
  let borrowerTwo = {};
  if (multiple) {
    borrowerTwo = {
      salary: f.income2,
      bonusExists: f.bonusExists,
      bonus: {
        bonus2014: f.bonus12,
        bonus2015: f.bonus22,
        bonus2016: f.bonus32,
        bonus2017: f.bonus42,
      },
      bankFortune: f.fortune2,
      insuranceSecondPillar: f.insurance12,
      insuranceThirdPillar: f.insurance22,
      sameAddress: true,
    };
  }

  const loanRequest = {
    general: {
      purchaseType: f.purchaseType,
      oldestAge: multiple ? f.oldestAge : f.age,
      oldestGender: multiple ? f.oldestGender : f.gender,
      fortuneUsed: f.fortuneUsed,
      insuranceFortuneUsed: f.insuranceFortuneUsed,
    },
    property: {
      usageType: f.usageType,
      value: f.propertyValue,
      propertyWork: f.propertyWork || 0,
      investmentRent: f.propertyRent,
    },
    borrowers: [],
  };

  return cleanMethod('insertBorrower', { object: borrowerOne, userId })
    .then(id1 => loanRequest.borrowers.push(id1))
    .then(() =>
      !!multiple &&
        cleanMethod('insertBorrower', { object: borrowerTwo, userId }))
    .then(id2 => !!id2 && loanRequest.borrowers.push(id2))
    .then(() => cleanMethod('insertRequest', { object: loanRequest, userId }))
    .then(() => userId);
};

export default saveStartForm;
