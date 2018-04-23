import React from 'react';
import PropTypes from 'prop-types';

import CarouselCardText from './CarouselCardText';

const CarouselCard = ({ left, review: { name, text, title } }) => (
  <div className="carousel-card card1" style={{ left: `${left}%` }}>
    <div className="carousel-card-top">
      <h2 className="carousel-card-name">{name}</h2>
      <p className="carousel-card-title">{title}</p>
    </div>
    <CarouselCardText name={name} title={title} text={text} />
  </div>
);

CarouselCard.propTypes = {
  left: PropTypes.number.isRequired,
  review: PropTypes.object.isRequired,
};

export default CarouselCard;
