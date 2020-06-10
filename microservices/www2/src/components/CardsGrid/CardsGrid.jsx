import React from 'react';
import { RichText } from 'prismic-reactjs';
import CardsGridItem from './CardsGridItem';
import './CardsGrid.scss';

const CardsGrid = ({ primary, fields }) => {
  return (
    <div className="cards container">
      <div className="cards-heading">{RichText.render(primary.heading)}</div>

      <div className="cards-grid">
        {fields &&
          fields.map((item, idx) => <CardsGridItem key={idx} {...item} />)}
      </div>
    </div>
  );
};

export default CardsGrid;
