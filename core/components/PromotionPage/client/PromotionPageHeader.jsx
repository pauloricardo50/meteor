// @flow
import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';

import { PROMOTIONS_COLLECTION } from 'core/api/constants';
import StatusLabel from '../../StatusLabel';
import T from '../../Translation';
import PromotionMetadataContext from './PromotionMetadata';
import CustomerAdder from './CustomerAdder';
import PromotionAdministration from './PromotionAdministration';

type PromotionPageHeaderProps = {};

const PromotionPageHeader = ({ promotion }: PromotionPageHeaderProps) => {
  const {
    _id: promotionId,
    documents: { promotionImage = [{ url: '/img/placeholder.png' }] } = {},
    name,
    address1,
    zipCode,
    city,
    status,
    promotionLots = [],
  } = promotion;
  const {
    permissions: { canInviteCustomers },
  } = useContext(PromotionMetadataContext);

  return (
    <div
      className="promotion-page-header"
      style={{ backgroundImage: `url("${promotionImage[0].url}")` }}
    >
      <div className="promotion-page-header-top">
        <div className="promotion-page-header-text">
          <h4>
            {address1}
            {', '}
            {zipCode}
            {' '}
            {city}
          </h4>
          <div className="promotion-page-header-title flex center-align">
            <h1>{name}</h1>
            <StatusLabel
              status={status}
              collection={PROMOTIONS_COLLECTION}
              allowModify={Meteor.microservice === 'admin'}
              docId={promotionId}
            />
          </div>
          <h4>
            <T
              id="PromotionPage.subtitle"
              values={{ promotionLotCount: promotionLots.length }}
            />
          </h4>
        </div>
        {Meteor.microservice !== 'app' && (
          <div className="promotion-page-header-actions">
            {canInviteCustomers && <CustomerAdder promotion={promotion} />}
            <PromotionAdministration promotion={promotion} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionPageHeader;
