import currentInterestRates from '../../../interestRates/queries/currentInterestRates';

const interestRatesAPI = ({ user, body, params, query }) =>
  currentInterestRates.clone().fetch();

export default interestRatesAPI;
