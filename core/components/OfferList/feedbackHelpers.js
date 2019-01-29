import moment from 'moment';

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

const greetings = ({ contactName, formatMessage }) =>
  formatMessage({ id: 'Feedback.greetings' }, { contactName });

const introduction = ({
  borrowers,
  singleBorrower,
  address,
  formatMessage,
}) => {
  if (singleBorrower) {
    return formatMessage(
      { id: 'Feedback.introduction.singleBorrower' },
      {
        borrower: borrowers[0].name,
        address,
      },
    );
  }

  return formatMessage(
    { id: 'Feedback.introduction.twoBorrowers' },
    {
      borrower1: borrowers[0].name,
      borrower2: borrowers[1].name,
      address,
    },
  );
};

const outro = ({ borrowers, singleBorrower, option, formatMessage }) => {
  if (singleBorrower) {
    return formatMessage(
      { id: `Feedback.${option}.outro.singleBorrower` },
      {
        borrower: borrowers[0].name,
      },
    );
  }

  return formatMessage(
    { id: `Feedback.${option}.outro.twoBorrowers` },
    {
      borrower1: borrowers[0].name,
      borrower2: borrowers[1].name,
    },
  );
};

const closing = ({ assignee, formatMessage }) =>
  formatMessage({ id: 'Feedback.closing' }, { assignee });

export const makeFeedback = ({ model, offer, formatMessage }) => {
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
    // Replace all returns into HTML
    return customFeedback.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  let feedback = '';
  const singleBorrower = borrowers.length === 1;

  feedback = feedback.concat(greetings({ contactName, formatMessage }));
  feedback = feedback.concat(introduction({ borrowers, singleBorrower, address, formatMessage }));
  feedback = feedback.concat(formatMessage({ id: `Feedback.${option}.body` }, { singleBorrower }));

  if (
    comments.length
    && option
    && FEEDBACK_OPTIONS_SETTINGS[option].enableComments
  ) {
    feedback = feedback.concat(formatMessage({ id: `Feedback.${option}.comments` }, { singleBorrower }));
    feedback = feedback.concat(
      '<ul>',
      comments
        .filter(x => x)
        .map(comment => `<li><b>${comment}</b></li>`)
        .join('\n'),
      '</ul>',
    );
  }

  if (option && FEEDBACK_OPTIONS_SETTINGS[option].enableOutro) {
    feedback = feedback.concat(outro({ option, singleBorrower, borrowers, formatMessage }));
  }

  feedback = feedback.concat(closing({ assignee, formatMessage }));

  return feedback;
};
