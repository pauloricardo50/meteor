import './PromotionsGrid.scss';

import React, { useContext } from 'react';

import LanguageContext from '../../contexts/LanguageContext';
import useAllPromotion from '../../hooks/useAllPromotion';
import { getLanguageData } from '../../utils/languages';
import Button from '../Button';

const PromotionsGridItem = ({ language, promotion }) => {
  const { name, images, summary, address } = promotion;
  return (
    <div className="promotion-item">
      {/* TODO: add slider for multiple images */}
      {images && (
        <div className="promotion-item__images">
          {images.map((promoImage) => (
            <img
              key={promoImage.name}
              src={promoImage.url}
              alt={`${promotion.name}_${promoImage.name}`}
            />
          ))}
        </div>
      )}

      <h3 className="promotion-item__name">
        {name}
        {/* <span>{promotion.address}</span> */}
      </h3>

      {summary && <p className="promotion-item__summary">{summary}</p>}

      <div className="promotion-item__footer">
        <div className="interest-button">
          <Button raised className="button" type="submit">
            {getLanguageData(language).promoInterest}
          </Button>
        </div>
      </div>
    </div>
  );
};
const PromotionsGrid = () => {
  const promotions = useAllPromotion();
  const [language] = useContext(LanguageContext);

  return (
    <div className="promotions container">
      {/* TODO: add filtering in next phase */}
      <div className="promotions-grid">
        {promotions &&
          promotions.map((promotion) => (
            <PromotionsGridItem
              key={promotion.id}
              language={language}
              promotion={promotion}
            />
          ))}
      </div>
    </div>
  );
};

export default PromotionsGrid;
