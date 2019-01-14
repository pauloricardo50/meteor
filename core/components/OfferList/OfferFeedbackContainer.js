import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';

import { offerSendFeedback } from '../../api';

const schema = new SimpleSchema({
  feedback: {
    type: String,
    optional: false,
    uniforms: {
      multiline: true,
      rows: 10,
      rowsMax: 10,
      style: { width: '500px' },
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
