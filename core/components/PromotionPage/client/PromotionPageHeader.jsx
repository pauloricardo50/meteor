// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { promotionRemove } from '../../../api/methods';
import { PROMOTIONS_COLLECTION, ROLES } from '../../../api/constants';
import ImageCarrousel from '../../ImageCarrousel';
import ConfirmMethod from '../../ConfirmMethod';
import StatusLabel from '../../StatusLabel';
import T from '../../Translation';
import PromotionModifier from './PromotionModifier';
import PromotionAssignee from './PromotionAssignee';
import PromotionLender from './PromotionLender';

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
  const {
    _id: promotionId,
    name,
    promotionLots = [],
    status,
    documents,
    contacts = [],
  } = promotion;
  const mergedContacts = mergeInvitedByWithContacts({
    contacts,
    invitedByUser,
  });
  const { logos = [], promotionImage = [{ url: '/img/placeholder.png' }] } = documents || {};
  const userIsDev = currentUser.roles.includes(ROLES.DEV);

  return (
    <div className="promotion-page-header">
      <div className="promotion-page-header-left">
        <div className="promotion-title animated fadeIn">
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
              />
            )}
          </h1>
          <h3 className="secondary">
            <T
              id="PromotionPage.subtitle"
              values={{ promotionLotCount: promotionLots.length }}
            />
          </h3>
          {Meteor.microservice === 'admin' && (
            <PromotionAssignee promotion={promotion} />
          )}
          {Meteor.microservice === 'admin' && (
            <PromotionLender promotion={promotion} />
          )}
        </div>

        {logos.length > 0 ? (
          <div className="logos animated fadeIn delay-200">
            <h3>
              <T id="PromotionPageHeader.partners" />
            </h3>

            <div className="list">
              {logos.map(logo => (
                <div className="logo" key={logo.Key}>
                  <div className="logo-wrapper">
                    <img src={logo.url} alt="" />
                  </div>
                  <p className="text-center bold">{logo.name.split('.')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ height: '150px' }} />
        )}
        {mergedContacts.length > 0 ? (
          <div className="contacts animated fadeIn delay-400">
            <h3>
              <T
                id="PromotionPageHeader.contacts"
                values={{ multipleContacts: mergedContacts.length > 1 }}
              />
            </h3>

            <div className="list">
              {mergedContacts.map(({ name: contactName, phoneNumber, title, email }) => (
                <div className="contact" key={email}>
                  <h4 className="name">{contactName}</h4>
                  <span className="title secondary">{title}</span>
                  {phoneNumber && (
                    <span className="phone-number">{phoneNumber}</span>
                  )}
                  {email && <span className="email">{email}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ height: '150px' }} />
        )}
      </div>
      <div className="promotion-page-header-right">
        <ImageCarrousel images={promotionImage.map(({ url }) => url)} />
        {/* <span
          style={{ backgroundImage: `url("${promotionImage[0].url}")` }}
          className="promotion-image animated fadeIn" // delay-400"
        /> */}
      </div>
    </div>
  );
};

export default PromotionPageHeader;
