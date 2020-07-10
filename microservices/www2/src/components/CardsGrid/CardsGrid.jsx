import './CardsGrid.scss';

import React from 'react';

import { RichText } from '../prismic';
import CardsGridItem from './CardsGridItem';

const CardsGrid = ({ primary, fields }) => (
  <div className="cards container">
    <div className="cards-heading">
      <RichText render={primary.heading} />
    </div>

    <div className="cards-grid">
      {fields &&
        fields.map((item, idx) => <CardsGridItem key={idx} {...item} />)}
    </div>
  </div>
);

export default CardsGrid;
