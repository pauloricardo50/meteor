import cleanMethod from '/imports/api/cleanMethods';

// The final function that inserts the documents once the form is finished
const saveStartForm = (f, history) => {
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
    otherIncome: f.otherIncomeArray || [],
    expenses: f.expensesArray || [],
    realEstate: f.realEstateArray || [],
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
  };

  const insertRequest = (id1, id2 = false) => {
    loanRequest.borrowers = [id1];
    if (id2) {
      loanRequest.borrowers.push(id2);
    }
    cleanMethod('insertRequest', loanRequest, undefined, (err, requestId) =>
      // history.push(`/app/requests/${requestId}`),
      history.push('/app'),
    );
  };

  // Insert each document
  cleanMethod('insertBorrower', borrowerOne, undefined, (err1, result1) => {
    if (multiple) {
      // borrowerTwo.sameAddress = result1; TODO: use this to identify which
      // borrower has the same address as whom
      cleanMethod('insertBorrower', borrowerTwo, undefined, (err2, result2) =>
        insertRequest(result1, result2),
      );
    } else {
      insertRequest(result1);
    }
  });
};

export default saveStartForm;
