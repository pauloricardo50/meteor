// @flow
import SimpleSchema from 'simpl-schema';
import React from 'react';
import { withProps } from 'recompose';
import { AutoFormDialog } from '../../../core/components/AutoForm2';
import T from '../../../core/components/Translation';
import { PropertySchema } from '../../../core/api/properties/properties';
import { propertyUpdate } from '../../../core/api/methods';

type ProPromotionLotModifierProps = {
  promotionLot: Object,
  updateProperty: Function,
};

const schema = new SimpleSchema({
  name: String,
  value: { type: Number, optional: true },
});

const ProPromotionLotModifier = ({
  promotionLot,
  updateProperty,
}: ProPromotionLotModifierProps) => (
  <AutoFormDialog
    buttonProps={{
      label: <T id="ProPromotionLotPage.modifyPromotionLot" />,
      raised: true,
      primary: true,
    }}
    schema={schema}
    onSubmit={updateProperty}
    model={
      promotionLot.properties
      && promotionLot.properties.length > 0
      && promotionLot.properties[0]
    }
  />
);

export default withProps(({ promotionLot }) => ({
  updateProperty: property => propertyUpdate.run({
    propertyId: promotionLot.properties[0]._id,
    object: property,
  }),
}))(ProPromotionLotModifier);
