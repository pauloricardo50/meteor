import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withProps } from 'recompose';

import { promotionLotRemove } from '../../../../api/promotionLots/methodDefinitions';
import { PROMOTION_LOT_STATUS } from '../../../../api/promotionLots/promotionLotConstants';
import { propertyUpdate } from '../../../../api/properties/methodDefinitions';
import { AutoFormDialog } from '../../../AutoForm2';
import T from '../../../Translation';
import { promotionLotSchema } from '../PromotionAdministration/PromotionAdministrationContainer';

const disableModification = promotionLotStatus => {
  const isAdmin = Meteor.microservice === 'admin';
  return isAdmin
    ? false
    : promotionLotStatus !== PROMOTION_LOT_STATUS.AVAILABLE;
};

const ProPromotionLotModifier = ({
  promotionLot,
  updateProperty,
  deletePromotionLot,
  className,
}) => {
  const model =
    promotionLot.properties &&
    promotionLot.properties.length > 0 &&
    promotionLot.properties[0];
  return (
    <AutoFormDialog
      buttonProps={{
        label: <T id="PromotionLotPage.modifyPromotionLot" />,
        raised: true,
        primary: true,
        disabled: disableModification(promotionLot.status),
        className,
      }}
      title={<T id="PromotionLotPage.modifyPromotionLot" />}
      description={<T id="PromotionPage.promotionLotValueDescription" />}
      schema={promotionLotSchema}
      onSubmit={updateProperty}
      model={model}
      onDelete={() => deletePromotionLot()}
    />
  );
};

export default compose(
  withProps(({ promotionLot }) => ({
    updateProperty: property =>
      propertyUpdate.run({
        propertyId: promotionLot.properties[0]._id,
        object: property,
      }),
    deletePromotionLot: () =>
      promotionLotRemove.run({ promotionLotId: promotionLot._id }),
  })),
)(ProPromotionLotModifier);
