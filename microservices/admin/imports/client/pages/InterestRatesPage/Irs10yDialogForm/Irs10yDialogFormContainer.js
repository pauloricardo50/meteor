import SimpleSchema from 'simpl-schema';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { withProps, compose, withState } from 'recompose';
import {
  irs10yInsert,
  irs10yUpdate,
  irs10yRemove,
} from 'imports/core/api/methods/index';
import { PercentField } from 'imports/core/components/PercentInput/';

const irs10ySchema = new SimpleSchema({
  date: {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  rate: { type: Number, min: 0, max: 1, uniforms: { component: PercentField } },
});

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting }) => ({
    schema: irs10ySchema,
    insertIrs10y: data => irs10yInsert.run({ irs10y: data }),
    modifyIrs10y: (data) => {
      const { _id: irs10yId, ...object } = data;
      setSubmitting(true);
      return irs10yUpdate
        .run({ irs10yId, object })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
    removeIrs10y: (irs10yId) => {
      setSubmitting(true);
      return irs10yRemove
        .run({ irs10yId })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
);
