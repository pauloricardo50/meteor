// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { compose, withState, withProps } from 'recompose';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2/AutoFormDialog';
import message from '../../../../utils/message';
import Button from '../../../Button';
import { lotRemove, lotUpdate } from '../../../../api';
import { lotSchema } from '../ProPromotionLotsTable/ProPromotionLotsTable';

type AdditionalLotModifierProps = {
  lot: Object,
  promotionLots: Array<Object>,
  open: boolean,
  setOpen: Function,
  updateAdditionalLot: Function,
  submitting: boolean,
  currentPromotionLotId: String,
  deleteAdditionalLot: Function,
};

const AdditionalLotModifierSchema = (promotionLots = []) =>
  lotSchema.extend(new SimpleSchema({
    promotionLot: {
      type: String,
      allowedValues: [...promotionLots.map(({ _id }) => _id), null],
      optional: true,
      uniforms: {
        transform: _id =>
          (_id ? (
            promotionLots.find(promotionLot => promotionLot._id === _id).name
          ) : (
            <T id="PromotionPage.AdditionalLotsTable.nonAllocated" />
          )),
        labelProps: { shrink: true },
      },
    },
  }));

const AdditionalLotModifier = ({
  lot,
  promotionLots,
  open,
  setOpen,
  submitting,
  currentPromotionLotId,
  updateAdditionalLot,
  deleteAdditionalLot,
}: AdditionalLotModifierProps) => {
  const schema = AdditionalLotModifierSchema(promotionLots);
  const model = {
    ...lot,
    promotionLot: currentPromotionLotId,
  };
  return (
    <AutoFormDialog
      schema={schema}
      model={model}
      onSubmit={updateAdditionalLot}
      open={open}
      setOpen={setOpen}
      submitting={submitting}
      renderAdditionalActions={({ closeDialog }) => (
        <Button
          onClick={() => deleteAdditionalLot(lot._id, closeDialog)}
          error
          disabled={submitting}
        >
          <T id="general.delete" />
        </Button>
      )}
    />
  );
};

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ lot }) => ({
    currentPromotionLotId:
      lot.promotionLots.length > 0 ? lot.promotionLots[0]._id : null,
  })),
  withProps(({ setOpen, setSubmitting }) => ({
    updateAdditionalLot: (values) => {
      console.log('additional lot values', values);
      const {
        _id: lotId,
        name,
        description,
        value,
        promotionLot: promotionLotId,
      } = values;
      setSubmitting(true);
      return lotUpdate
        .run({
          lotId,
          object: { promotionLotId, name, description, value },
        })
        .then(() => {
          setOpen(false);
          message.success("C'est dans la boite !", 2);
        })
        .finally(() => setSubmitting(false));
    },
    deleteAdditionalLot: (lotId, closeDialog) => {
      setSubmitting(true);

      return lotRemove
        .run({ lotId })
        .then(closeDialog)
        .then(() => setSubmitting(false));
    },
  })),
)(AdditionalLotModifier);
