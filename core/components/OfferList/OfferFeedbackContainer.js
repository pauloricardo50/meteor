import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { offerSendFeedback } from '../../api/offers/methodDefinitions';
import Calculator from '../../utils/Calculator';
import { CUSTOM_AUTOFIELD_TYPES } from '../AutoForm2/autoFormConstants';
import {
  FEEDBACK_OPTIONS,
  FEEDBACK_OPTIONS_SETTINGS,
  makeFeedback,
} from './feedbackHelpers';

const getSchema = ({ offer, formatMessage, loan }) =>
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
      customAutoValue: model =>
        makeFeedback({ model, offer, loan, formatMessage }),
    },
  });

export default withProps(({ offer, loan }) => {
  const { formatMessage } = useIntl();
  const schema = useMemo(() => getSchema({ offer, formatMessage, loan }), [
    loan,
  ]);
  const { _id: offerId, feedback = {} } = offer;
  const { contact } = Calculator.selectLenderForOfferId({
    loan,
    offerId,
  });

  const { message } = feedback;

  return {
    schema,
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
          feedback: makeFeedback({ model: object, offer, loan, formatMessage }),
        });
      }
      return Promise.resolve();
    },
  };
});
