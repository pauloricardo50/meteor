// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { compose, withState, withProps } from 'recompose';

import { lotRemove, lotUpdate } from '../../../../api';
import { AutoFormDialog } from '../../../AutoForm2/AutoFormDialog';
import T from '../../../Translation';
import Button from '../../../Button';
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
      allowedValues: promotionLots.map(({ _id }) => _id),
      optional: true,
      uniforms: {
        transform: _id =>
          (_id ? (
            promotionLots.find(promotionLot => promotionLot._id === _id).name
          ) : (
            <T id="PromotionPage.AdditionalLotsTable.nonAllocated" />
          )),
        labelProps: { shrink: true },
        placeholder: 'Non alloué',
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
  canRemoveLots,
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
      renderAdditionalActions={({ closeDialog, setDisableActions, disabled }) =>
        canRemoveLots && (
          <Button
            onClick={() =>
              deleteAdditionalLot({
                lotId: lot._id,
                closeDialog,
                setDisableActions,
              })
            }
            error
            disabled={submitting || disabled}
          >
            <T id="general.delete" />
          </Button>
        )
      }
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
    updateAdditionalLot: ({
      _id: lotId,
      name,
      description,
      value,
      promotionLot: promotionLotId,
    }) => {
      setSubmitting(true);
      return lotUpdate
        .run({
          lotId,
          object: { promotionLotId, name, description, value },
        })
        .then(() => {
          setOpen(false);
          import('../../../../utils/message').then(({ default: message }) => {
            message.success("C'est dans la boite !", 2);
          });
        })
        .finally(() => setSubmitting(false));
    },
    deleteAdditionalLot: ({ lotId, closeDialog, setDisableActions }) => {
      setSubmitting(true);
      setDisableActions(true);
      return lotRemove
        .run({ lotId })
        .then(closeDialog)
        .finally(() => {
          setDisableActions(false);
          setSubmitting(false);
        });
    },
  })),
)(AdditionalLotModifier);
