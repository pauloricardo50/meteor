// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { promotionRemove } from '../../../../api/methods';
import { PROMOTIONS_COLLECTION, ROLES } from '../../../../api/constants';
import ConfirmMethod from '../../../ConfirmMethod';
import T from '../../../Translation';
import StatusLabel from '../../../StatusLabel';
import PromotionModifier from './PromotionModifier';

type PromotionPageTitleProps = {};

const PromotionPageTitle = ({
  currentUser,
  promotion,
  canModifyPromotion,
}: PromotionPageTitleProps) => {
  const { _id: promotionId, name, status } = promotion;
  const userIsDev = currentUser.roles.includes(ROLES.DEV);

  return (
    <h1>
      {name}
      &nbsp;
      {status && (
        <StatusLabel
          status={status}
          collection={PROMOTIONS_COLLECTION}
          allowModify={Meteor.microservice === 'admin'}
          docId={promotionId}
        />
      )}
      {canModifyPromotion && <PromotionModifier promotion={promotion} />}
      {userIsDev && (
        <ConfirmMethod
          method={() => promotionRemove.run({ promotionId })}
          label={<T id="general.remove" />}
          buttonProps={{ error: true, outlined: true }}
          keyword="SUPPRIMER PROMO"
        />
      )}
    </h1>
  );
};

export default PromotionPageTitle;
