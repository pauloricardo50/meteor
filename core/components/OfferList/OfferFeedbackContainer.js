import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { BoolField } from 'uniforms-material';

import { offerSendFeedback } from '../../api/offers/methodDefinitions';
import Calculator from '../../utils/Calculator';
import { CUSTOM_AUTOFIELD_TYPES } from '../AutoForm2/autoFormConstants';
import {
  FEEDBACK_OPTIONS,
  FEEDBACK_OPTIONS_SETTINGS,
  makeFeedback,
} from './feedbackHelpers';

const replaceHtmlTags = str => {
  const replaceMap = [
    {
      tags: ['<br/>'],
      replaceWith: '\n',
    },
    {
      tags: ['<b>', '</b>', '<ul>', '</ul>', '</li>'],
      replaceWith: '',
    },
    {
      tags: ['<li>'],
      replaceWith: '-',
    },
  ];

  let res = str;

  replaceMap.forEach(({ tags, replaceWith }) => {
    tags.forEach(tag => {
      res = res.replaceAll(tag, replaceWith);
    });
  });

  return res;
};

const getSchema = ({ offer, formatMessage, loan, setModel }) =>
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
    modifyFeedback: {
      type: Boolean,
      optional: true,
      condition: ({ option }) => option && option !== FEEDBACK_OPTIONS.CUSTOM,
      uniforms: {
        label: 'Réutiliser le modèle',
        render: ({ model, ...props }) => {
          setModel({
            ...model,
            option: model.modifyFeedback
              ? FEEDBACK_OPTIONS.CUSTOM
              : model.option,
            customFeedback: model.modifyFeedback
              ? replaceHtmlTags(
                  makeFeedback({
                    model,
                    offer,
                    loan,
                    formatMessage,
                  }),
                )
              : undefined,
            modifyFeedback:
              model.modifyFeedback === true ? false : model.modifyFeedback,
          });

          return <BoolField {...props} model={model} />;
        },
      },
    },
  });

export default withProps(({ offer, loan }) => {
  const { formatMessage } = useIntl();
  const [model, setModel] = useState({});
  const schema = useMemo(
    () => getSchema({ offer, formatMessage, loan, setModel }),
    [loan, model.modifyFeedback],
  );
  const { _id: offerId, feedback = {} } = offer;
  const { contact } = Calculator.selectLenderForOfferId({
    loan,
    offerId,
  });

  const { message } = feedback;

  return {
    schema,
    model,
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
