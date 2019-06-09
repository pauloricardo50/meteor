// @flow
import React from 'react';

import T from '../../../Translation';

type PromotionPageLogosProps = {};

const PromotionPageLogos = ({ logos = [] }: PromotionPageLogosProps) => {
  if (logos.length === 0) {
    return <div style={{ height: '150px' }} />;
  }

  return (
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
            <p className="text-center bold">
              {logo.name
                .split('.')
                .slice(0, -1)
                .join('.')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PromotionPageLogos;
