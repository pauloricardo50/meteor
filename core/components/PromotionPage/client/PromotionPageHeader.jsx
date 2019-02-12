// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { PROMOTIONS_COLLECTION } from '../../../api/constants';
import StatusLabel from '../../StatusLabel';
import T from '../../Translation';
import PromotionModifier from './PromotionModifier';
import PromotionAssignee from './PromotionAssignee';

type PromotionPageHeaderProps = {};

const PromotionPageHeader = ({
  promotion,
  canModifyPromotion,
}: PromotionPageHeaderProps) => {
  const {
    _id: promotionId,
    name,
    promotionLots = [],
    status,
    documents,
    contacts = [],
  } = promotion;
  const { logos = [], promotionImage = [{ url: '/img/placeholder.png' }] } = documents || {};

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
        {contacts.length > 0 ? (
          <div className="contacts animated fadeIn delay-400">
            <h3>
              <T
                id="PromotionPageHeader.contacts"
                values={{ multipleContacts: contacts.length > 1 }}
              />
            </h3>

            <div className="list">
              {contacts.map(({ name: contactName, phoneNumber, title, email }) => (
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
        <span
          style={{ backgroundImage: `url("${promotionImage[0].url}")` }}
          className="promotion-image animated fadeIn" // delay-400"
        />
      </div>
    </div>
  );
};

export default PromotionPageHeader;
