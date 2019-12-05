import Calculator from '../../utils/Calculator';
import { ANONYMIZED_STRING } from '../security/constants';

export const getLoanProgress = loan => ({
  info: Calculator.getValidFieldsRatio({ loan }),
  documents: Calculator.getValidDocumentsRatio({ loan }),
});

const ANONYMIZED_USER = {
  name: ANONYMIZED_STRING,
  phoneNumbers: [ANONYMIZED_STRING],
  email: ANONYMIZED_STRING,
};

const anonymizeUser = ({ user, anonymous }) =>
  anonymous ? { name: 'Anonyme' } : { ...user, ...ANONYMIZED_USER };

export const anonymizeLoan = ({ loan, shouldAnonymize }) => {
  if (!shouldAnonymize) {
    return loan;
  }

  const { properties = [] } = loan;

  return {
    ...loan,
    user: anonymizeUser(loan),
    properties: properties.map(({ solvent, ...property }) => property),
    proNote: null,
    isAnonymized: true,
  };
};
