//      
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { withProps, compose, withState } from 'recompose';

import { propertyUpdate, promotionLotRemove } from '../../../../api/methods';
import { PROMOTION_LOT_STATUS } from '../../../../api/constants';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2';
import Button from '../../../Button';
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
  submitting,
  deletePromotionLot,
  className,
}                              ) => {
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
      submitting={submitting}
      model={model}
      renderAdditionalActions={({
        closeDialog,
        setDisableActions,
        disabled,
      }) => (
        <Button
          onClick={() => {
            setDisableActions(true);
            return deletePromotionLot()
              .then(closeDialog)
              .finally(() => setDisableActions(false));
          }}
          error
          disabled={submitting || disabled}
        >
          <T id="general.delete" />
        </Button>
      )}
    />
  );
};

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
