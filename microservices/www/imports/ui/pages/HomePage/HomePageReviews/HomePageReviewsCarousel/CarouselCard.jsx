import React from 'react';
import PropTypes from 'prop-types';

const CarouselCard = ({ left, review: { name, text, title } }) => (
  <div className="carousel-card card1" style={{ left: `${left}%` }}>
    <div className="carousel-card-top">
      <h2 className="carousel-card-name">{name}</h2>
      <p className="carousel-card-title">{title}</p>
    </div>
    <p className="carousel-card-text">{text}</p>
  </div>
);

CarouselCard.propTypes = {
  left: PropTypes.number.isRequired,
  review: PropTypes.object.isRequired,
};

export default CarouselCard;
