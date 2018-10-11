// @flow
import React from 'react';

import { PROMOTIONS_COLLECTION } from '../../../api/constants';
import StatusLabel from '../../StatusLabel';
import T from '../../Translation';
import PromotionModifier from './PromotionModifier';

type PromotionPageHeaderProps = {};

const PromotionPageHeader = ({
  promotion,
  canModify,
}: PromotionPageHeaderProps) => {
  const { name, promotionLots = [], status, documents } = promotion;
  const { logos = [], promotionImage = [{ url: '/img/placeholder.png' }] } = documents || {};

  return (
    <div className="promotion-page-header">
      <div className="promotion-page-header-left">
        <div className="promotion-title">
          <h1>
            {name}
            &nbsp;
            {status && (
              <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />
            )}
            {canModify && <PromotionModifier promotion={promotion} />}
          </h1>
          <h3 className="secondary">
            <T
              id="PromotionPage.subtitle"
              values={{ promotionLotCount: promotionLots.length }}
            />
          </h3>
        </div>

        <div className="logos">
          {logos.map(logo => (
            <div className="logo">
              <img src={logo.url} alt="" key={logo.Key} />
              <p className="text-center bold">{logo.name.split('.')[0]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="promotion-page-header-right">
        <span
          style={{ backgroundImage: `url(${promotionImage[0].url})` }}
          className="promotion-image"
        />
      </div>
    </div>
  );
};

export default PromotionPageHeader;
