const randInArray = array => array[Math.floor(Math.random() * array.length)];

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

  return randInArray(conditions);
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

  return randInArray(counterparts);
};

const round = v => Math.round(v * 10000) / 10000;

const rand = (min, max) => round(Math.random() * (max - min) + min);

export const getRandomOffer = ({ loan }) => {
  const rate1 = rand(0.007, 0.012);

  const loanWanted = loan.structures[0].wantedLoan;
  const maxAmountLimited = loanWanted > 100000000 ? 100000000 : loanWanted;
  const counterpart = getRandomCounterpart();
  const condition = getRandomCondition();
  return {
    organisation: 'fake',
    loanId: loan._id,
    maxAmount: maxAmountLimited,
    amortizationGoal: randInArray([0.65, 0.6, 0.5]),
    interestLibor: rate1,
    interest1: round(rate1 + rand(0.0004, 0.0016)),
    interest2: round(rate1 + rand(0.0016, 0.004)),
    interest5: round(rate1 + rand(0.004, 0.006)),
    interest10: round(rate1 + rand(0.006, 0.01)),
    conditions: [condition, counterpart].filter(x => x),
  };
};
