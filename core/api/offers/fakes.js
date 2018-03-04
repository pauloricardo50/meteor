import { getLoanValue, getPropAndWork } from 'core/utils/loanFunctions';

const getRandomCondition = () => {
  const conditions = [
    'Expertise additionelle requise',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];

  return conditions[Math.floor(Math.random() * conditions.length)];
};

const getRandomCounterpart = () => {
  const counterparts = [
    'Gestion de toute la fortune',
    'Souscrire à une assurance vie',
    "Gestion de CHF 100'000 de patrimoine minimum",
    'Souscrire à une assurance voiture',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];

  return counterparts[Math.floor(Math.random() * counterparts.length)];
};

const round = v => Math.round(v * 10000) / 10000;

const rand = (min, max) => round(Math.random() * (max - min) + min);

export const getRandomOffer = ({ loan, property }, matchLoanWanted = false) => {
  const rate1 = rand(0.007, 0.012);
  const rate2 = rand(0.005, 0.009);

  // Randomly add rank 1 offers 25% of the time
  const loanWanted =
    Math.random() > 0.75 && !matchLoanWanted
      ? 0.65 * getPropAndWork({ loan, property })
      : getLoanValue({ loan, property });
  const maxAmountLimited = loanWanted > 100000000 ? 100000000 : loanWanted;
  const counterpart = getRandomCounterpart();
  const condition = getRandomCondition();
  return {
    organization: 'fake',
    canton: 'GE',
    loanId: loan._id,
    auctionEndTime: new Date(),
    isSwiss: true,
    worksForOwnCompany: true,
    standardOffer: {
      maxAmount: maxAmountLimited,
      amortization: 0.01,
      interestLibor: rate1,
      interest1: round(rate1 + rand(0.0004, 0.0016)),
      interest2: round(rate1 + rand(0.0016, 0.004)),
      interest5: round(rate1 + rand(0.004, 0.006)),
      interest10: round(rate1 + rand(0.006, 0.01)),
    },
    counterpartOffer: {
      maxAmount: maxAmountLimited,
      amortization: 0.01,
      interestLibor: rate2,
      interest1: round(rate2 + rand(0.0004, 0.0016)),
      interest2: round(rate2 + rand(0.0016, 0.004)),
      interest5: round(rate2 + rand(0.004, 0.006)),
      interest10: round(rate2 + rand(0.006, 0.01)),
    },
    counterparts: counterpart ? [counterpart] : [],
    conditions: condition ? [condition] : [],
  };
};
