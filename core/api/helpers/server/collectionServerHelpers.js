import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';
import LoanService from '../../loans/server/LoanService';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import { LOANS_COLLECTION } from '../../loans/loanConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../../insuranceRequests/insuranceRequestConstants';

// Pads a number with zeros: 4 --> 0004
const zeroPadding = (num, places) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
};

const getInsuranceRequestNameSuffix = loanId => {
  const loan = LoanService.get(loanId, { insuranceRequests: { name: 1 } });
  const [lastInsuranceRequest] =
    loan?.insuranceRequests
      ?.sort(({ name: a }, { name: b }) =>
        a.localeCompare(b, 'en', { numeric: true }),
      )
      .slice(-1) || [];

  if (!lastInsuranceRequest) {
    return '-A';
  }

  const { name } = lastInsuranceRequest;
  const [lastSuffixLetter] = name.split('-').slice(-1);

  if (lastSuffixLetter === 'Z') {
    throw new Error(
      'Le maximum de dossiers assurances liés à une hypothèque est de 26',
    );
  }

  const nextSuffixLetter = String.fromCharCode(
    lastSuffixLetter.charCodeAt(0) + 1,
  );
  return `-${nextSuffixLetter}`;
};

const getInsuranceNamePrefix = (insurances = []) => {
  if (insurances.length === 0) {
    return '01';
  }

  const [lastInsuranceName] = insurances
    .map(({ name }) => name)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(-1);

  const lastInsurancePrefixNumber = parseInt(
    lastInsuranceName
      .split('-')
      .slice(-1)[0]
      .slice(1, 3),
    10,
  );

  const nextPrefixNumber = zeroPadding(lastInsurancePrefixNumber + 1, 2);

  return nextPrefixNumber;
};

const getNewBaseName = now => {
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
    return `${yearPrefix}-0001`;
  }

  const [lastName] = [lastLoan?.name, lastInsuranceRequest?.name]
    .filter(x => x)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(-1);

  const [lastPrefix, count] = lastName
    .split('-')
    .map(numb => parseInt(numb, 10));

  if (lastPrefix !== yearPrefix) {
    return `${yearPrefix}-0001`;
  }

  const nextCountString = zeroPadding(count + 1, 4);

  return `${yearPrefix}-${nextCountString}`;
};

const getNewInsuranceName = insuranceRequestId => {
  const {
    name: insuranceRequestName,
    insurances = [],
  } = InsuranceRequestService.get(insuranceRequestId, {
    name: 1,
    insurances: { name: 1 },
  });

  return `${insuranceRequestName}${getInsuranceNamePrefix(insurances)}`;
};

const getNewLoanName = ({ insuranceRequestId, now }) => {
  if (insuranceRequestId) {
    const {
      name: insuranceRequestName,
    } = InsuranceRequestService.get(insuranceRequestId, { name: 1 });
    const loanName = insuranceRequestName
      .split('-')
      .slice(0, 2)
      .join('-');
    return loanName;
  }

  return getNewBaseName(now);
};

const getNewInsuranceRequestName = ({ loanId, now }) => {
  const nameSuffix = getInsuranceRequestNameSuffix(loanId);

  if (loanId) {
    const { name: loanName } = LoanService.get(loanId, { name: 1 });
    return `${loanName}${nameSuffix}`;
  }

  return `${getNewBaseName(now)}${nameSuffix}`;
};

export const getNewName = ({
  collection,
  loanId,
  insuranceRequestId,
  now = new Date(),
}) => {
  switch (collection) {
    case LOANS_COLLECTION:
      return getNewLoanName({ insuranceRequestId, now });
    case INSURANCE_REQUESTS_COLLECTION:
      return getNewInsuranceRequestName({ loanId, now });
    case INSURANCES_COLLECTION:
      return getNewInsuranceName(insuranceRequestId);
    default:
      return '';
  }
};
