import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';

import { offerSendFeedback } from '../../api';
import { FEEDBACK_OPTIONS, makeFeedback } from './feedbackHelpers';

const schema = ({ offer }) =>
  new SimpleSchema({
    option: {
      type: String,
      optional: false,
      allowedValues: Object.values(FEEDBACK_OPTIONS),
      uniforms: { displayEmpty: false, placeholder: '' },
    },
    comments: {
      type: Array,
      optional: true,
      defaultValue: [],
      condition: ({ option }) =>
        [
          FEEDBACK_OPTIONS.POSITIVE,
          FEEDBACK_OPTIONS.NEGATIVE_NOT_COMPETITIVE,
        ].includes(option),
    },
    'comments.$': { type: String, optional: true },
    feedback: {
      type: String,
      optional: false,
      uniforms: {
        multiline: true,
        rows: 10,
        rowsMax: 10,
        style: { width: '500px' },
      },
      condition: ({ option }) => !!option,
      customAutoValue: model => makeFeedback({ model, offer }),
    },
  });

export default withProps(({ offer }) => {
  const {
    _id: offerId,
    feedback,
    lender: { contact },
  } = offer;

  return {
    schema: schema({ offer }),
    onSubmit: (object) => {
      if (feedback) {
        return Promise.resolve();
      }

      const { name } = contact || {};
      const confirm = window.confirm(`Envoyer le feedback à ${name} ? Attention: le feedback ne pourra plus être modifié !`);
      if (confirm) {
        return offerSendFeedback.run({ offerId, feedback: object.feedback });
      }
      return Promise.resolve();
    },
  };
});
