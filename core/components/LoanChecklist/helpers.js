import { documentHasTooltip, documentIsBasic } from 'core/api/files/documents';
import { PROPERTY_CATEGORY } from '../../api/constants';
import Calculator from '../../utils/Calculator';

const getChecklistProperty = props => {
  const { loan = {} } = props;
  const { properties = [] } = loan;
  const property = Calculator.selectProperty({ loan });

  if (property?._id) {
    return property;
  }

  if (
    properties.length >= 1 &&
    properties[0].category === PROPERTY_CATEGORY.USER
  ) {
    // If the user has entered properties, but not yet a structure
    // Use the first property as a initial checklist
    return properties[0];
  }

  return {};
};

const shouldDisplayPropertyChecklist = props => {
  const { loan = {} } = props;
  const property = getChecklistProperty(props);

  if (loan.hasPromotion) {
    return false;
  }

  return !!property._id;
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

const formatFileTitle = ({ doc, file }, formatMessage) => {
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

const formatFileTooltip = ({ doc, file }, formatMessage) => {
  const tooltip = tooltipOverrider(doc, file);

  return (
    tooltip ||
    (documentHasTooltip(file) && formatMessage({ id: `files.${file}.tooltip` }))
  );
};

const getPropertyMissingFields = (props, formatMessage) => {
  const { loan = {} } = props;
  const displayPropertyChecklist = shouldDisplayPropertyChecklist(props);
  const property = getChecklistProperty(props);

  return {
    ...(displayPropertyChecklist
      ? {
          property: {
            title:
              (property && property.address1) ||
              formatMessage({ id: 'general.property' }),
            labels: Calculator.getMissingPropertyFields({
              loan,
              property,
            }).map(field => formatMessage({ id: `Forms.${field}` })),
          },
        }
      : {}),
  };
};

const getPropertyMissingDocuments = (props, formatMessage) => {
  const { loan = {}, basicDocumentsOnly } = props;
  const displayPropertyChecklist = shouldDisplayPropertyChecklist(props);
  const property = getChecklistProperty(props);

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
              property,
            }).map(file => ({
              label: formatFileTitle({ doc: property, file }, formatMessage),
              tooltip: formatFileTooltip(
                { doc: property, file },
                formatMessage,
              ),
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

const getLoanMissingDocuments = (props, formatMessage) => {
  const { loan = {} } = props;
  const missingDocuments = Calculator.getMissingLoanDocuments({ loan });

  return {
    loan: {
      title: formatMessage({ id: 'files.OTHER' }),
      labels: missingDocuments.map(file => ({
        label: formatFileTitle({ doc: loan, file }, formatMessage),
        tooltip: formatFileTooltip({ doc: loan, file }, formatMessage),
        basic: false,
      })),
    },
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
          label: formatFileTitle({ doc: borrower, file }, formatMessage),
          tooltip: formatFileTooltip({ doc: borrower, file }, formatMessage),
          basic: documentIsBasic(file),
        })),
      };
    }),
  };
};

export const getChecklistValidInformationsRatio = props => {
  const property = getChecklistProperty(props);

  return [
    Calculator.getBorrowersValidFieldsRatio(props),
    Calculator.getBorrowersValidDocumentsRatio(props),
    Calculator.getPropertyValidFieldsRatio({ ...props, property }),
    Calculator.getPropertyValidDocumentsRatio({ ...props, property }),
    Calculator.getLoanValidDocumentsRatio(props),
  ]
    .filter(x => x)
    .reduce(
      (ratio, { valid, required }) => ({
        valid: ratio.valid + valid,
        required: ratio.required + required,
      }),
      { valid: 0, required: 0 },
    );
};

export const getChecklistMissingInformations = (...args) => ({
  fields: {
    ...getPropertyMissingFields(...args),
    ...getBorrowersMissingFields(...args),
  },

  documents: {
    ...getPropertyMissingDocuments(...args),
    ...getBorrowersMissingDocuments(...args),
    ...getLoanMissingDocuments(...args),
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
