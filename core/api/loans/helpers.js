import Calculator from '../../utils/Calculator';

export const getLoanProgress = loan => ({
  info: Calculator.getValidFieldsRatio({ loan }),
  documents: Calculator.getValidDocumentsRatio({ loan }),
});
