import { Meteor } from 'meteor/meteor';

import React, { useMemo } from 'react';
import { compose, withProps } from 'recompose';

import {
  promotionLotRemove,
  updateLotPromotionLotGroups,
} from '../../../../api/promotionLots/methodDefinitions';
import { PROMOTION_LOT_STATUS } from '../../../../api/promotionLots/promotionLotConstants';
import { propertyUpdate } from '../../../../api/properties/methodDefinitions';
import { AutoFormDialog } from '../../../AutoForm2';
import T from '../../../Translation';
import {
  getPromotionLotSchema,
  promotionLotFormLayout,
} from '../PromotionAdministration/PromotionAdministrationContainer';

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
  const { promotionLotGroupIds } = promotionLot;
  const schema = useMemo(
    () => getPromotionLotSchema(promotionLot.promotion?.promotionLotGroups),
    [promotionLot],
  );

  const property =
    promotionLot?.properties?.length && promotionLot.properties[0];

  const model = { ...property, promotionLotGroupIds };

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
      schema={schema}
      onSubmit={updateProperty}
      model={model}
      onDelete={() => deletePromotionLot()}
      layout={promotionLotFormLayout}
    />
  );
};

export default compose(
  withProps(({ promotionLot }) => ({
    updateProperty: ({ promotionLotGroupIds, ...property }) =>
      propertyUpdate
        .run({
          propertyId: promotionLot.properties[0]._id,
          object: property,
        })
        .then(() =>
          updateLotPromotionLotGroups.run({
            promotionLotId: promotionLot._id,
            promotionLotGroupIds,
          }),
        ),
    deletePromotionLot: () =>
      promotionLotRemove.run({ promotionLotId: promotionLot._id }),
  })),
)(ProPromotionLotModifier);
