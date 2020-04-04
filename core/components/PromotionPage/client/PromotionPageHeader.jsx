import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';

import { promotionSetStatus } from '../../../api/promotions/methodDefinitions';
import { PROMOTIONS_COLLECTION } from '../../../api/promotions/promotionConstants';
import CollectionIconLink from '../../IconLink/CollectionIconLink';
import ImageCarrousel from '../../ImageCarrousel';
import StatusLabel from '../../StatusLabel';
import { LightTheme } from '../../Themes';
import T from '../../Translation';
import CustomerAdder from './CustomerAdder';
import PromotionAdministration from './PromotionAdministration';
import PromotionAssignee from './PromotionAssignee';
import PromotionLender from './PromotionLender';
import PromotionMetadataContext from './PromotionMetadata';

const PromotionPageHeader = ({ promotion }) => {
  const {
    _id: promotionId,
    documents: { promotionImage = [{ url: '/img/placeholder.png' }] } = {},
    name,
    address1,
    zipCode,
    city,
    status,
    promotionLots = [],
    promotionLoan,
  } = promotion;
  const {
    permissions: {
      canInviteCustomers,
      canModifyStatus,
      canLinkAssignee,
      canLinkLender,
    },
  } = useContext(PromotionMetadataContext);

  return (
    <ImageCarrousel
      className="promotion-page-header"
      images={promotionImage.map(({ url }) => url)}
    >
      <div className="promotion-page-header-top">
        <div className="promotion-page-header-text">
          <h4>{`${address1}, ${zipCode} ${city}`}</h4>
          <div className="promotion-page-header-title flex center-align">
            <h1>{name}</h1>
            <StatusLabel
              status={status}
              collection={PROMOTIONS_COLLECTION}
              allowModify={canModifyStatus}
              docId={promotionId}
              method={nextStatus =>
                promotionSetStatus.run({ promotionId, status: nextStatus })
              }
            />
          </div>
          <h4>
            <T
              id="PromotionPage.subtitle"
              values={{ promotionLotCount: promotionLots.length }}
            />
          </h4>
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
