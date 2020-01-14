import { documentHasTooltip, documentIsBasic } from 'core/api/files/documents';
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

const labelOverrider = (doc, id) => {
  const additionalDocument = doc.additionalDocuments.find(
    ({ id: documentId }) => documentId === id,
  );

  if (additionalDocument) {
    return additionalDocument.label;
  }

  return false;
};

const formatFileTitle = ({ doc, formatMessage, file }) => {
  const label = labelOverrider(doc, file);

  return label || formatMessage({ id: `files.${file}` });
};

const tooltipOverrider = (doc, id) => {
  const additionalDocument = doc.additionalDocuments.find(
    ({ id: documentId }) => documentId === id,
  );

  if (additionalDocument) {
    return additionalDocument.tooltip;
  }

  return false;
};

const formatFileTooltip = ({ doc, formatMessage, file }) => {
  const tooltip = tooltipOverrider(doc, file);

  return (
    tooltip ||
    (documentHasTooltip(file) && formatMessage({ id: `files.${file}.tooltip` }))
  );
};

const getPropertyMissingFields = (props, formatMessage) => {
  const { loan = {} } = props;
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

const getPropertyMissingDocuments = (props, formatMessage) => {
  const { loan = {}, basicDocumentsOnly } = props;
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
              basicDocumentsOnly,
            }).map(file => ({
              label: formatFileTitle({ doc: property, formatMessage, file }),
              tooltip: formatFileTooltip({
                doc: property,
                formatMessage,
                file,
              }),
              basic: documentIsBasic(file),
            })),
          },
        }
      : {}),
  };
};

const getBorrowersMissingFields = (props, formatMessage) => {
  const { loan = {} } = props;
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

const getBorrowersMissingDocuments = (props, formatMessage) => {
  const { loan = {}, basicDocumentsOnly } = props;
  const { borrowers = [] } = loan;

  return {
    borrowers: borrowers.map((borrower, index) => {
      const missingDocuments = Calculator.getMissingBorrowerDocuments({
        loan,
        borrowers: borrower,
        basicDocumentsOnly,
      });
      return {
        title:
          borrower.name ||
          formatMessage(
            { id: 'general.borrowerWithIndex' },
            { index: index + 1 },
          ),
        labels: missingDocuments.map(file => ({
          label: formatFileTitle({ doc: borrower, formatMessage, file }),
          tooltip: formatFileTooltip({ doc: borrower, formatMessage, file }),
          basic: documentIsBasic(file),
        })),
      };
    }),
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

export const getChecklistMissingInformations = (...args) => ({
  fields: {
    ...getPropertyMissingFields(...args),
    ...getBorrowersMissingFields(...args),
  },

  documents: {
    ...getPropertyMissingDocuments(...args),
    ...getBorrowersMissingDocuments(...args),
  },
});

export const isAnyBasicDocumentRequested = documents => {
  const {
    property: { labels: propertyLabels = [] } = {},
    borrowers = [],
  } = documents;
  return (
    propertyLabels.some(({ basic }) => basic) ||
    borrowers.some(({ labels: borrowerLabels = [] }) =>
      borrowerLabels.some(({ basic }) => basic),
    )
  );
};
