import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';

import { offerSendFeedback } from '../../api';
import { CUSTOM_AUTOFIELD_TYPES } from '../AutoForm2/constants';

const schema = new SimpleSchema({
  feedback: {
    type: String,
    optional: false,
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.TEXT_AREA,
    },
  },
});

export default withProps(({
  offer: {
    _id: offerId,
    feedback,
    lender: { contact },
  },
}) => ({
  schema,
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
}));
