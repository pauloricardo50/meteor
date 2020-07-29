import { createFakeInterestRates } from './interestRatesFixtures';
import { createTestPromotion } from './promotionFixtures';

const createGatsbyFixtures = () => {
  createFakeInterestRates({ number: 10 });
  createTestPromotion({
    lots: 3,
    users: 0,
    pros: 0,
    promotionName: 'Test promotion 1',
  });
};

export default createGatsbyFixtures;
