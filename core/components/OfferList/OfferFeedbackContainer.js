import { injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { offerSendFeedback } from '../../api';
import { CUSTOM_AUTOFIELD_TYPES } from '../AutoForm2/autoFormConstants';
import {
  FEEDBACK_OPTIONS,
  FEEDBACK_OPTIONS_SETTINGS,
  makeFeedback,
} from './feedbackHelpers';

const schema = ({ offer, formatMessage }) =>
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
    'comments.$': {
      type: String,
      optional: true,
      uniforms: { placeholder: '' },
    },
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
        type: CUSTOM_AUTOFIELD_TYPES.HTML_PREVIEW,
      },
      condition: ({ option }) => option && option !== FEEDBACK_OPTIONS.CUSTOM,
      customAutoValue: model => makeFeedback({ model, offer, formatMessage }),
    },
  });

export default compose(
  injectIntl,
  withProps(({ offer, intl: { formatMessage } }) => {
    const {
      _id: offerId,
      feedback = {},
      lender: { contact },
    } = offer;

    const { message } = feedback;

    return {
      schema: schema({ offer, formatMessage }),
      onSubmit: object => {
        if (message) {
          return Promise.resolve();
        }

        const { name } = contact || {};
        const confirm = window.confirm(
          `Envoyer le feedback à ${name} ? Attention: le feedback ne pourra plus être modifié ! L'admin assigné à ce dossier recevra également l'email en BCC.`,
        );
        if (confirm) {
          return offerSendFeedback.run({
            offerId,
            feedback: makeFeedback({ model: object, offer, formatMessage }),
          });
        }
        return Promise.resolve();
      },
    };
  }),
);
