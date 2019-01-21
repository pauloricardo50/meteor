import formatMessage from 'core/utils/intl';

export const FEEDBACK_OPTIONS = {
  POSITIVE: 'POSITIVE',
  NEGATIVE_NOT_COMPETITIVE: 'NEGATIVE_NOT_COMPETITIVE',
  NEGATIVE_WITHOUT_FOLLOW_UP: 'NEGATIVE_WITHOUT_FOLLOW_UP',
  CUSTOM: 'CUSTOM',
};

export const FEEDBACK_OPTIONS_SETTINGS = {
  [FEEDBACK_OPTIONS.POSITIVE]: {
    enableComments: true,
    enableOutro: true,
  },
  [FEEDBACK_OPTIONS.NEGATIVE_NOT_COMPETITIVE]: {
    enableComments: true,
    enableOutro: true,
  },
  [FEEDBACK_OPTIONS.NEGATIVE_WITHOUT_FOLLOW_UP]: {
    enableComments: false,
  },
  [FEEDBACK_OPTIONS.CUSTOM]: {
    enableComments: false,
    enableOutro: false,
  },
};

const greetings = contactName =>
  formatMessage('Feedback.greetings', { contactName });

const introduction = ({ borrowers, singleBorrower, address }) => {
  if (singleBorrower) {
    return formatMessage('Feedback.introduction.singleBorrower', {
      borrower: borrowers[0].name,
      address,
    });
  }

  return formatMessage('Feedback.introduction.twoBorrowers', {
    borrower1: borrowers[0].name,
    borrower2: borrowers[1].name,
    address,
  });
};

const outro = ({ borrowers, singleBorrower, option }) => {
  if (singleBorrower) {
    return formatMessage(`Feedback.${option}.outro.singleBorrowers`, {
      borrower: borrowers[0].name,
    });
  }

  return formatMessage(`Feedback.${option}.outro.twoBorrowers`, {
    borrower1: borrowers[0].name,
    borrower2: borrowers[1].name,
  });
};

const closing = assignee => formatMessage('Feedback.closing', { assignee });

export const makeFeedback = ({ model, offer }) => {
  const { option, comments = [], customFeedback } = model;
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

  if (customFeedback && option === FEEDBACK_OPTIONS.CUSTOM) {
    return customFeedback;
  }

  let feedback = '';
  const singleBorrower = borrowers.length === 1;

  feedback = feedback.concat(greetings(contactName));
  feedback = feedback.concat(introduction({ borrowers, singleBorrower, address }));
  feedback = feedback.concat(formatMessage(`Feedback.${option}.body`, { singleBorrower }));

  if (
    comments.length
    && option
    && FEEDBACK_OPTIONS_SETTINGS[option].enableComments
  ) {
    feedback = feedback.concat(formatMessage(`Feedback.${option}.comments`, { singleBorrower }));
    feedback = feedback.concat(comments.map(comment => `- ${comment}`).join('\n'));
  }

  if (option && FEEDBACK_OPTIONS_SETTINGS[option].enableOutro) {
    feedback = feedback.concat(outro({ option, singleBorrower, borrowers }));
  }

  feedback = feedback.concat(closing(assignee));

  return feedback;
};
