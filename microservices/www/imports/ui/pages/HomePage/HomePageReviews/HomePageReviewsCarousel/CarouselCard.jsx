import React from 'react';
import PropTypes from 'prop-types';

const CarouselCard = ({ left, review: { name, text } }) => (
  <div className="carousel-card card1" style={{ left: `${left}%` }}>
    <h2>{name}</h2>
    <p>{text}</p>
  </div>
);

CarouselCard.propTypes = {
  left: PropTypes.number.isRequired,
  review: PropTypes.object.isRequired,
};

export default CarouselCard;
