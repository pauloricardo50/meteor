// @flow
import SimpleSchema from 'simpl-schema';
import React from 'react';
import { withProps, compose, withState } from 'recompose';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import { propertyUpdate } from 'core/api/methods';
import { PROMOTION_LOT_STATUS } from 'core/api/constants';
import { promotionLotRemove } from 'core/api';

type ProPromotionLotModifierProps = {
  promotionLot: Object,
  updateProperty: Function,
  submitting: boolean,
  deletePromotionLot: Function,
};

const schema = new SimpleSchema({
  name: String,
  value: { type: Number, optional: true },
});

const ProPromotionLotModifier = ({
  promotionLot,
  updateProperty,
  submitting,
  deletePromotionLot,
}: ProPromotionLotModifierProps) => (
  <AutoFormDialog
    buttonProps={{
      label: <T id="ProPromotionLotPage.modifyPromotionLot" />,
      raised: true,
      primary: true,
      disabled: promotionLot.status !== PROMOTION_LOT_STATUS.AVAILABLE,
    }}
    schema={schema}
    onSubmit={updateProperty}
    submitting={submitting}
    model={
      promotionLot.properties
      && promotionLot.properties.length > 0
      && promotionLot.properties[0]
    }
    renderAdditionalActions={({ closeDialog }) => (
      <Button
        onClick={() => deletePromotionLot().then(closeDialog)}
        error
        disabled={submitting}
      >
        <T id="general.delete" />
      </Button>
    )}
  />
);

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ promotionLot, setSubmitting }) => ({
    updateProperty: property =>
      propertyUpdate.run({
        propertyId: promotionLot.properties[0]._id,
        object: property,
      }),
    deletePromotionLot: () => {
      setSubmitting(true);
      return promotionLotRemove
        .run({ promotionLotId: promotionLot._id })
        .then(() => setSubmitting(false));
    },
  })),
)(ProPromotionLotModifier);
