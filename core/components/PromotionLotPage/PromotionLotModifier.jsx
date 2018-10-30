// @flow
import React from 'react';
import { withProps, compose, withState } from 'recompose';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import { propertyUpdate } from 'core/api/methods';
import {
  PROMOTION_LOT_STATUS,
  PROMOTION_LOT_QUERIES,
} from 'core/api/constants';
import { promotionLotRemove } from 'core/api';
import ClientEventService from 'core/api/events/ClientEventService/index';
import { promotionLotSchema } from '../PromotionPage/client/ProPromotionLotsTable/ProPromotionLotsTable';

type ProPromotionLotModifierProps = {
  promotionLot: Object,
  updateProperty: Function,
  submitting: boolean,
  deletePromotionLot: Function,
};

const ProPromotionLotModifier = ({
  promotionLot,
  updateProperty,
  submitting,
  deletePromotionLot,
}: ProPromotionLotModifierProps) => (
  <AutoFormDialog
    buttonProps={{
      label: <T id="PromotionLotPage.modifyPromotionLot" />,
      raised: true,
      primary: true,
      disabled: promotionLot.status !== PROMOTION_LOT_STATUS.AVAILABLE,
    }}
    schema={promotionLotSchema}
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
  withProps(({ promotionLot, setSubmitting }) => {
    const refresh = () =>
      ClientEventService.emit(PROMOTION_LOT_QUERIES.PRO_PROMOTION_LOT);
    return {
      updateProperty: property =>
        propertyUpdate
          .run({
            propertyId: promotionLot.properties[0]._id,
            object: property,
          })
          .then(refresh),
      deletePromotionLot: () => {
        setSubmitting(true);
        return promotionLotRemove
          .run({ promotionLotId: promotionLot._id })
          .then(() => setSubmitting(false))
          .then(refresh);
      },
    };
  }),
)(ProPromotionLotModifier);
