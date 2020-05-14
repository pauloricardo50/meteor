import React from 'react';
import Button from '../Button';
import useAllPromotion from '../../hooks/useAllPromotion';
import './PromotionsGrid.scss';

const PromotionsGridItem = ({ promotion }) => (
  <div className="promotion-item">
    {/* TODO: add slider for multiple images */}
    {promotion.images && (
      <img
        src={promotion.images[0].url}
        alt={`${promotion.name}_${promotion.images[0].name}`}
      />
    )}
    <h2>
      {promotion.name}
      <span>{promotion.address}</span>
    </h2>
    <p className="promotion-summary">
      {/* {promotion.summary} */}
      No data from API, so... Lorem ipsum dolor sit amet, consectetur adipiscing
      elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
    <div className="promotion-footer">
      <div className="promoter">
        {/* Promoteur<span>{promotion.promoter.name}</span> */}
        Promoteur<span>No data from API</span>
      </div>
      <div className="interest-button">
        <Button primary raised className="button" type="submit">
          {/* TODO: hardcode for now, translation will be added later */}
          Je suis intéressé
        </Button>
      </div>
    </div>
  </div>
);

const PromotionsGrid = ({ fields }) => {
  const promotions = useAllPromotion();

  return (
    <div className="promotions container">
      {/* TODO: add filtering in next phase */}
      <div className="promotions-grid">
        {promotions &&
          promotions.map(promotion => (
            <PromotionsGridItem key={promotion.id} promotion={promotion} />
          ))}
      </div>
    </div>
  );
};

export default PromotionsGrid;
