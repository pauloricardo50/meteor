// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import omit from 'lodash/omit';

import { compose, withState, withProps } from 'recompose';
import {
  lotUpdate,
  addLotToPromotionLot,
  removeLotLink,
} from 'core/api/methods';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2/AutoFormDialog';
import { LOT_TYPES } from '../../../../api/constants';
import message from '../../../../utils/message';

type AdditionalLotModifierProps = {
  lot: Object,
  promotionLots: Array<Object>,
  open: boolean,
  setOpen: Function,
  updateAdditionalLot: Function,
  submitting: boolean,
  currentPromotionLotId: String,
};

const AdditionalLotModifierSchema = promotionLots =>
  new SimpleSchema({
    name: String,
    type: {
      type: String,
      allowedValues: Object.values(LOT_TYPES),
    },
    value: { type: Number, defaultValue: 0, optional: true },
    description: { type: String, optional: true },
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
      },
    },
  });

const AdditionalLotModifier = ({
  lot,
  promotionLots,
  open,
  setOpen,
  submitting,
  currentPromotionLotId,
  updateAdditionalLot,
}: AdditionalLotModifierProps) => (
  <AutoFormDialog
    schema={AdditionalLotModifierSchema(promotionLots)}
    model={{
      ...omit(lot, 'promotionLots'),
      promotionLot: currentPromotionLotId,
    }}
    onSubmit={updateAdditionalLot}
    open={open}
    setOpen={setOpen}
    submitting={submitting}
  />
);

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ lot }) => ({
    currentPromotionLotId:
      lot.promotionLots.length > 0 && lot.promotionLots[0]._id,
  })),
  withProps(({ setOpen, setSubmitting, currentPromotionLotId }) => ({
    updateAdditionalLot: ({
      _id: lotId,
      name,
      description,
      value,
      promotionLot: promotionLotId,
    }) => {
      setSubmitting(true);
      return lotUpdate
        .run({ lotId, object: { name, description, value } })
        .then(() =>
          currentPromotionLotId
            && currentPromotionLotId !== promotionLotId
            && removeLotLink.run({ promotionLotId: currentPromotionLotId, lotId }))
        .then(() =>
          promotionLotId
            && currentPromotionLotId !== promotionLotId
            && addLotToPromotionLot.run({ promotionLotId, lotId }))
        .then(() => {
          setOpen(false);
          message.success("C'est dans la boite !", 2);
        })
        .finally(() => setSubmitting(false));
    },
  })),
)(AdditionalLotModifier);
