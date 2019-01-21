import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';

import { offerSendFeedback } from '../../api';
import {
  FEEDBACK_OPTIONS,
  makeFeedback,
  FEEDBACK_OPTIONS_SETTINGS,
} from './feedbackHelpers';

const schema = ({ offer }) =>
  new SimpleSchema({
    option: {
      type: String,
      optional: true,
      allowedValues: Object.values(FEEDBACK_OPTIONS),
      uniforms: { displayEmpty: false, placeholder: '' },
    },
    comments: {
      type: Array,
      optional: true,
      condition: ({ option }) =>
        option && FEEDBACK_OPTIONS_SETTINGS[option].enableComments,
    },
    'comments.$': { type: String, optional: true },
    customFeedback: {
      type: String,
      optional: true,
      uniforms: {
        multiline: true,
        rows: 15,
        rowsMax: 15,
        style: { width: '500px' },
      },
      condition: ({ option }) => option === FEEDBACK_OPTIONS.CUSTOM,
    },
    feedbackPreview: {
      type: String,
      optional: true,
      uniforms: {
        multiline: true,
        rows: 15,
        rowsMax: 15,
        style: { width: '500px' },
        disabled: true,
      },
      condition: ({ option }) => option && option !== FEEDBACK_OPTIONS.CUSTOM,
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
        return offerSendFeedback.run({
          offerId,
          feedback: makeFeedback({ model: object, offer }),
        });
      }
      return Promise.resolve();
    },
  };
});
