// @flow
import React from 'react';

import { PROMOTIONS_COLLECTION } from '../../../api/constants';
import StatusLabel from '../../StatusLabel';
import T from '../../Translation';

type PromotionPageHeaderProps = {};

const PromotionPageHeader = ({
  promotion: { name, promotionLots, status, documents },
}: PromotionPageHeaderProps) => {
  const {
    logos = [{ url: '/img/placeholder.png' }],
    promotionImage = [{ url: '/img/placeholder.png' }],
  } = documents || {};

  return (
    <div className="promotion-page-header">
      <div className="promotion-page-header-left">
        <div>
          <h2>
            {name}
            &nbsp;
            {status && (
              <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />
            )}
          </h2>
          <h3 className="secondary">
            <T
              id="PromotionPage.subtitle"
              values={{ promotionLotCount: promotionLots.length }}
            />
          </h3>
        </div>

        <div className="logos">
          {logos.map(logo => (
            <img src={logo.url} alt="" key={logo.Key} />
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
