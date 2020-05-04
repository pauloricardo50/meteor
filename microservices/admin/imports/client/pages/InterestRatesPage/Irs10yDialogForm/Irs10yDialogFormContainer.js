import { compose, withProps, withState } from 'recompose';
import SimpleSchema from 'simpl-schema';

import {
  irs10yInsert,
  irs10yRemove,
  irs10yUpdate,
} from 'core/api/irs10y/methodDefinitions';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';
import PercentInput from 'core/components/PercentInput';

const irs10ySchema = new SimpleSchema({
  date: {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  rate: {
    type: Number,
    min: -1,
    max: 1,
    uniforms: { component: PercentInput },
  },
});

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting }) => ({
    schema: irs10ySchema,
    insertIrs10y: data => irs10yInsert.run({ irs10y: data }),
    modifyIrs10y: data => {
      const { _id: irs10yId, ...object } = data;
      setSubmitting(true);
      return irs10yUpdate
        .run({ irs10yId, object })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
    removeIrs10y: irs10yId => {
      setSubmitting(true);
      return irs10yRemove
        .run({ irs10yId })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
);
