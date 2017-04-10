import { getLoanValue } from '/imports/js/helpers/requestFunctions';

const getRandomCondition = () => {
  const conditions = [
    'Gestion de toute la fortune',
    'Souscrire à une assurance vie',
    "Gestion de CHF 100'000 de patrimoine minimum",
    'Souscrire à une assurance voiture',
  ];

  return conditions[Math.floor(Math.random() * conditions.length)];
};

const round = v => Math.round(v * 100) / 100;

const rand = (min, max) => round(Math.random() * (max - min) + min);

export const getRandomOffer = request => {
  const rate1 = rand(0.8, 1);
  const rate2 = rand(0.5, 0.75);

  const loanWanted = getLoanValue(request);

  return {
    organization: 'fake',
    canton: 'GE',
    requestId: request._id,
    auctionEndTime: new Date(),
    standardOffer: {
      maxAmount: loanWanted,
      amortizing: 1,
      interestLibor: rate1,
      interest1: round(rate1 + rand(0.08, 0.12)),
      interest2: round(rate1 + rand(0.16, 0.24)),
      interest5: round(rate1 + rand(0.4, 0.6)),
      interest10: round(rate1 + rand(0.8, 1)),
    },
    conditionsOffer: {
      maxAmount: loanWanted,
      amortizing: 1,
      interestLibor: rate2,
      interest1: round(rate2 + rand(0.08, 0.12)),
      interest2: round(rate2 + rand(0.16, 0.24)),
      interest5: round(rate2 + rand(0.4, 0.6)),
      interest10: round(rate2 + rand(0.8, 1)),
    },
    conditions: getRandomCondition(),
    expertiseRequired: true,
  };
};
