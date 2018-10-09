// @flow
import React from 'react';

import { PROMOTIONS_COLLECTION } from '../../../api/constants';
import StatusLabel from '../../StatusLabel';
import T from '../../Translation';

type PromotionPageHeaderProps = {};

const PromotionPageHeader = ({
  promotion: {
    name,
    promotionLots,
    status,
    imageUrl = '/img/placeholder.png',
    logos = ['/img/placeholder.png', '/img/placeholder.png'],
  },
}: PromotionPageHeaderProps) => (
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
          <img src={logo} alt="" key={logo} />
        ))}
      </div>
    </div>
    <div className="promotion-page-header-right">
      <span
        style={{ backgroundImage: `url(${imageUrl})` }}
        className="promotion-image"
      />
    </div>
  </div>
);

export default PromotionPageHeader;
