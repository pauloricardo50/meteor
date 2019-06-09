import { currentInterestRates } from '../../../interestRates/queries';

const interestRatesAPI = ({ user, body, params, query }) =>
  currentInterestRates.clone().fetch();

export default interestRatesAPI;
