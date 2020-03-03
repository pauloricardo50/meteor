import LoanService from '../../loans/server/LoanService';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';

// Pads a number with zeros: 4 --> 0004
const zeroPadding = (num, places) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
};

export const getNewLoanOrInsuranceRequestName = (
  now = new Date(),
  type = 'loan',
) => {
  const NAME_SUFFIX = {
    loan: '',
    insurance: '-A',
  };
  const year = now.getYear();
  const yearPrefix = year - 100;
  const lastLoan = LoanService.get(
    {},
    { name: 1, $options: { sort: { name: -1 } } },
  );
  const lastInsuranceRequest = InsuranceRequestService.get(
    {},
    { name: 1, $options: { sort: { name: -1 } } },
  );

  if (!lastLoan && !lastInsuranceRequest) {
    return `${yearPrefix}-0001${NAME_SUFFIX[type]}`;
  }

  const lastName = [lastLoan?.name, lastInsuranceRequest?.name]
    .filter(x => x)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(-1);

  const [lastPrefix, count] = lastName
    .split('-')
    .map(numb => parseInt(numb, 10));

  if (lastPrefix !== yearPrefix) {
    return `${yearPrefix}-0001${NAME_SUFFIX[type]}`;
  }

  const nextCountString = zeroPadding(count + 1, 4);

  return `${yearPrefix}-${nextCountString}${NAME_SUFFIX[type]}`;
};
