import { PROPERTY_CATEGORY } from '../../api/constants';
import Calculator from '../../utils/Calculator';

const shouldDisplayPropertyChecklist = props => {
  const { loan = {} } = props;
  const property = Calculator.selectProperty({ loan });
  return (
    !loan.hasPromotion &&
    property &&
    property._id && // Perform extra check in case property is an empty object
    property.category !== PROPERTY_CATEGORY.PRO
  );
};

const makeLabelOverrider = doc => id => {
  const additionalDocument = doc.additionalDocuments.find(
    ({ id: documentId }) => documentId === id,
  );

  if (additionalDocument) {
    return additionalDocument.label;
  }

  return false;
};

const formatFileTitle = ({ doc, formatMessage }) => file => {
  const labelOverrider = makeLabelOverrider(doc);
  const label = labelOverrider(file);

  return label || formatMessage({ id: `files.${file}` });
};

const getPropertyMissingFields = props => {
  const {
    loan = {},
    intl: { formatMessage },
  } = props;
  const displayPropertyChecklist = shouldDisplayPropertyChecklist(props);
  const property = Calculator.selectProperty({ loan });

  return {
    ...(displayPropertyChecklist
      ? {
          property: {
            title:
              (property && property.address1) ||
              formatMessage({ id: 'general.property' }),
            labels: Calculator.getMissingPropertyFields({ loan }).map(field =>
              formatMessage({ id: `Forms.${field}` }),
            ),
          },
        }
      : {}),
  };
};

const getPropertyMissingDocuments = props => {
  const {
    loan = {},
    intl: { formatMessage },
  } = props;
  const displayPropertyChecklist = shouldDisplayPropertyChecklist(props);
  const property = Calculator.selectProperty({ loan });

  return {
    ...(displayPropertyChecklist
      ? {
          property: {
            title:
              (property && property.address1) ||
              formatMessage({ id: 'general.property' }),
            labels: Calculator.getMissingPropertyDocuments({
              loan,
            }).map(formatFileTitle({ doc: property, formatMessage })),
          },
        }
      : {}),
  };
};

const getBorrowersMissingFields = props => {
  const {
    loan = {},
    intl: { formatMessage },
  } = props;
  const { borrowers = [] } = loan;

  return {
    borrowers: borrowers.map((borrower, index) => ({
      title:
        borrower.name ||
        formatMessage(
          { id: 'general.borrowerWithIndex' },
          { index: index + 1 },
        ),
      labels: Calculator.getMissingBorrowerFields({
        borrowers: borrower,
      }).map(field => formatMessage({ id: `Forms.${field}` })),
    })),
  };
};

const getBorrowersMissingDocuments = props => {
  const {
    loan = {},
    intl: { formatMessage },
  } = props;
  const { borrowers = [] } = loan;

  return {
    borrowers: borrowers.map((borrower, index) => ({
      title:
        borrower.name ||
        formatMessage(
          { id: 'general.borrowerWithIndex' },
          { index: index + 1 },
        ),
      labels: Calculator.getMissingBorrowerDocuments({
        loan,
        borrowers: borrower,
      }).map(formatFileTitle({ doc: borrower, formatMessage })),
    })),
  };
};

export const getChecklistValidInformationsRatio = props =>
  [
    Calculator.getBorrowersValidFieldsRatio(props),
    Calculator.getBorrowersValidDocumentsRatio(props),
    Calculator.getPropertyValidFieldsRatio(props),
    Calculator.getPropertyValidDocumentsRatio(props),
  ]
    .filter(x => x)
    .reduce(
      (ratio, { valid, required }) => ({
        valid: ratio.valid + valid,
        required: ratio.required + required,
      }),
      { valid: 0, required: 0 },
    );

export const getChecklistMissingInformations = props => ({
  fields: {
    ...getPropertyMissingFields(props),
    ...getBorrowersMissingFields(props),
  },
  documents: {
    ...getPropertyMissingDocuments(props),
    ...getBorrowersMissingDocuments(props),
  },
});
