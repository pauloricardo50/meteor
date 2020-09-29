import { Meteor } from 'meteor/meteor';

import React from 'react';

import { promotionSetStatus } from '../../../api/promotions/methodDefinitions';
import CollectionIconLink from '../../IconLink/CollectionIconLink';
import ImageCarrousel from '../../ImageCarrousel';
import StatusLabel from '../../StatusLabel';
import TestBadge from '../../TestBadge';
import { LightTheme } from '../../Themes';
import T from '../../Translation';
import CustomerAdder from './CustomerAdder';
import PromotionAdministration from './PromotionAdministration';
import PromotionAssignee from './PromotionAssignee';
import PromotionLender from './PromotionLender';
import { usePromotion } from './PromotionPageContext';

const PromotionPageHeader = ({ promotion }) => {
  const {
    _collection,
    _id: promotionId,
    address1,
    city,
    documents: { promotionImage = [{ url: '/img/placeholder.png' }] } = {},
    name,
    promotionLoan,
    promotionLotLinks = [],
    status,
    zipCode,
  } = promotion;
  const {
    permissions: {
      canInviteCustomers,
      canModifyStatus,
      canLinkAssignee,
      canLinkLender,
    },
  } = usePromotion();

  return (
    <ImageCarrousel
      className="promotion-page-header"
      images={promotionImage.map(({ url }) => url)}
    >
      <div className="promotion-page-header-top">
        <div className="promotion-page-header-text">
          <h3 className="font-size-5 secondary">{`${address1}, ${zipCode} ${city}`}</h3>
          <div className="promotion-page-header-title flex center-align">
            <h1 className="font-size-3">{name}</h1>
            <StatusLabel
              status={status}
              collection={_collection}
              allowModify={canModifyStatus}
              docId={promotionId}
              method={nextStatus =>
                promotionSetStatus.run({ promotionId, status: nextStatus })
              }
            />
            {Meteor.microservice !== 'app' && promotion?.isTest && (
              <TestBadge />
            )}
          </div>
          <h2 className="font-size-4">
            <T
              defaultMessage="Promotion immobilière - {promotionLotCount} lots"
              values={{ promotionLotCount: promotionLotLinks.length }}
            />
          </h2>
          <div className="promotion-page-header-linkers">
            <LightTheme>
              {canLinkAssignee && <PromotionAssignee promotion={promotion} />}
              {canLinkLender && <PromotionLender promotion={promotion} />}
            </LightTheme>
          </div>
          {Meteor.microservice === 'admin' && promotionLoan && (
            <div className="promotion-page-header-promotion-loan">
              <h4>Dossier de développement:</h4>
              <CollectionIconLink
                key={promotionLoan._id}
                relatedDoc={promotionLoan}
              />
            </div>
          )}
        </div>
        {Meteor.microservice !== 'app' && (
          <div className="promotion-page-header-actions">
            {canInviteCustomers && <CustomerAdder promotion={promotion} />}
            <PromotionAdministration promotion={promotion} />
          </div>
        )}
      </div>
    </ImageCarrousel>
  );
};

export default PromotionPageHeader;
