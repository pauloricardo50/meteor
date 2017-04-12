import { getLoanValue } from '/imports/js/helpers/requestFunctions';

const getRandomCondition = () => {
  const conditions = [
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

  return conditions[Math.floor(Math.random() * conditions.length)];
};

const round = v => Math.round(v * 10000) / 10000;

const rand = (min, max) => round(Math.random() * (max - min) + min);

export const getRandomOffer = request => {
  const rate1 = rand(0.007, 0.012);
  const rate2 = rand(0.005, 0.009);

  const loanWanted = getLoanValue(request);

  return {
    organization: 'fake',
    canton: 'GE',
    requestId: request._id,
    auctionEndTime: new Date(),
    standardOffer: {
      maxAmount: loanWanted,
      amortizing: 0.01,
      interestLibor: rate1,
      interest1: round(rate1 + rand(0.0004, 0.0016)),
      interest2: round(rate1 + rand(0.0016, 0.004)),
      interest5: round(rate1 + rand(0.004, 0.006)),
      interest10: round(rate1 + rand(0.006, 0.01)),
    },
    conditionsOffer: {
      maxAmount: loanWanted,
      amortizing: 0.01,
      interestLibor: rate2,
      interest1: round(rate2 + rand(0.0004, 0.0016)),
      interest2: round(rate2 + rand(0.0016, 0.004)),
      interest5: round(rate2 + rand(0.004, 0.006)),
      interest10: round(rate2 + rand(0.006, 0.01)),
    },
    conditions: getRandomCondition(),
    expertiseRequired: true,
  };
};
