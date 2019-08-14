// @flow
import React from 'react';

type PromotionPartnersProps = {};

const PromotionPartners = ({
  promotion: { documents: { logos = [] } = {} },
}: PromotionPartnersProps) => (
  <div className="promotion-partners animated fadeIn">
    {logos.map(logo => (
      <div className="logo card1 card-top" key={logo.Key}>
        <div className="logo-wrapper">
          <img src={logo.url} alt="" />
        </div>
        <p className="text-center bold">
          {logo.name
            .split('.')
            .slice(0, -1)
            .join('.')}
        </p>
      </div>
    ))}
  </div>
);

export default PromotionPartners;
