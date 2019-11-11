import { TRENDS } from './interestRatesConstants';

const randInArray = array => array[Math.floor(Math.random() * array.length)];

export const getRandomInterestRate = mean => {
  const rateLow = (mean - Math.random() * 0.2) / 100;
  const rateHigh = (mean + Math.random() * 0.2) / 100;
  const trend = randInArray(Object.values(TRENDS));
  return { rateLow, rateHigh, trend };
};
