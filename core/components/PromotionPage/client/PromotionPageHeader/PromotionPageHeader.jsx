// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import ImageCarrousel from '../../../ImageCarrousel';
import T from '../../../Translation';
import PromotionAssignee from './PromotionAssignee';
import PromotionLender from './PromotionLender';
import PromotionPageContacts from './PromotionPageContacts';
import PromotionPageLogos from './PromotionPageLogos';
import PromotionPageTitle from './PromotionPageTitle';

type PromotionPageHeaderProps = {};

const mergeInvitedByWithContacts = ({ invitedByUser = {}, contacts = [] }) => {
  if (!Object.keys(invitedByUser).length) {
    return contacts;
  }
  const { email } = invitedByUser;

  if (contacts.some(({ email: contactEmail }) => contactEmail === email)) {
    return contacts;
  }

  const organisation = invitedByUser
    && invitedByUser.organisations
    && !!invitedByUser.organisations.length
    && invitedByUser.organisations[0];

  const title = organisation && organisation.$metadata.title;

  return [
    ...contacts,
    { ...invitedByUser, title: title || 'Courtier immobilier' },
  ];
};

const PromotionPageHeader = ({
  invitedByUser,
  promotion,
  canModifyPromotion,
  currentUser,
}: PromotionPageHeaderProps) => {
  const { promotionLots = [], documents, contacts = [] } = promotion;
  const mergedContacts = mergeInvitedByWithContacts({
    contacts,
    invitedByUser,
  });
  const { logos = [], promotionImage = [{ url: '/img/placeholder.png' }] } = documents || {};

  return (
    <div className="promotion-page-header">
      <div className="promotion-page-header-left">
        <div className="promotion-title animated fadeIn">
          <PromotionPageTitle
            currentUser={currentUser}
            promotion={promotion}
            canModifyPromotion={canModifyPromotion}
          />

          <h3 className="secondary">
            <T
              id="PromotionPage.subtitle"
              values={{ promotionLotCount: promotionLots.length }}
            />
          </h3>

          {Meteor.microservice === 'admin' && (
            <>
              <PromotionAssignee promotion={promotion} />
              <PromotionLender promotion={promotion} />
            </>
          )}
        </div>

        <PromotionPageLogos logos={logos} />

        <PromotionPageContacts contacts={mergedContacts} />
      </div>
      <div className="promotion-page-header-right">
        <ImageCarrousel images={promotionImage.map(({ url }) => url)} />
      </div>
    </div>
  );
};

export default PromotionPageHeader;
