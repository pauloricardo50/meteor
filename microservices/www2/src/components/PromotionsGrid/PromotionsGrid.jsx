import React, { useContext } from 'react';
import Button from '../Button';
import useAllPromotion from '../../hooks/useAllPromotion';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import './PromotionsGrid.scss';

const PromotionsGridItem = ({ language, promotion }) => (
  <div className="promotion-item">
    {/* TODO: add slider for multiple images */}
    {promotion.images && (
      <div className="promotion-item__images">
        {promotion.images.map(promoImage => (
          <img
            key={promoImage.name}
            src={promoImage.url}
            alt={`${promotion.name}_${promoImage.name}`}
          />
        ))}
      </div>
    )}

    <h3 className="promotion-item__name">
      {promotion.name}
      {/* <span>{promotion.address}</span> */}
    </h3>

    {promotion.summary && (
      <p className="promotion-item__summary">{promotion.summary}</p>
    )}

    <div className="promotion-item__footer">
      <div className="interest-button">
        <Button raised className="button" type="submit">
          {getLanguageData(language).promoInterest}
        </Button>
      </div>
    </div>
  </div>
);

const PromotionsGrid = () => {
  const promotions = useAllPromotion();
  const [language] = useContext(LanguageContext);

  return (
    <div className="promotions container">
      {/* TODO: add filtering in next phase */}
      <div className="promotions-grid">
        {promotions &&
          promotions.map(promotion => (
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
