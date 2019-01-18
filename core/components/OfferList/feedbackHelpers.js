import formatMessage from 'core/utils/intl';

export const FEEDBACK_OPTIONS = {
  POSITIVE: 'POSITIVE',
  NEGATIVE_NOT_COMPETITIVE: 'NEGATIVE_NOT_COMPETITIVE',
  NEGATIVE_WITHOUT_FOLLOW_UP: 'NEGATIVE_WITHOUT_FOLLOW_UP',
  CUSTOM: 'CUSTOM',
};

const greetings = contactName =>
  formatMessage('Feedback.greetings', { contactName });

const introduction = ({ borrowers = [], address }) => {
  if (borrowers.length === 1) {
    return formatMessage('Feedback.introduction.singleBorrower', {
      borrower: borrowers[0].name,
      address,
    });
  }

  if (borrowers.length === 2) {
    return formatMessage('Feedback.introduction.twoBorrowers', {
      borrower1: borrowers[0].name,
      borrower2: borrowers[1].name,
      address,
    });
  }

  return '';
};

const closing = assignee => formatMessage('Feedback.closing', { assignee });

export const makeFeedback = ({ model, offer }) => {
  const { option, comments, feedback } = model;
  const {
    lender: {
      contact: { firstName: contactName },
      loan: {
        borrowers,
        user: {
          assignedEmployee: { name: assignee },
        },
      },
    },
    property: { address1, zipCode, city },
  } = offer;

  const address = `${address1}, ${zipCode} ${city}`;

  if (option === FEEDBACK_OPTIONS.CUSTOM) {
    return feedback;
  }

  let generatedFeedback = greetings(contactName);
  generatedFeedback = generatedFeedback.concat(introduction({ borrowers, address }));
  generatedFeedback = generatedFeedback.concat(formatMessage(`Feedback.${option}.body`, {
    singleBorrower: borrowers.length === 1,
  }));
  generatedFeedback = generatedFeedback.concat(closing(assignee));

  return generatedFeedback;
};
