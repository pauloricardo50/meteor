import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';

import CarouselCard from './CarouselCard';

const DISTANCE_PERCENT = 120;
const springConstants = { stiffness: 800, damping: 35 };

const getDefaultStyle = index => ({ left: index * DISTANCE_PERCENT });

const getStyle = (currentIndex, index) => ({
  left: spring((index - currentIndex) * DISTANCE_PERCENT, springConstants),
});

const MotionCarousel = ({ reviews, currentIndex }) => (
  <div className="carousel-wrapper">
    {reviews.map((review, index) => (
      <Motion
        key={review.name}
        defaultStyle={getDefaultStyle(index)}
        style={getStyle(currentIndex, index)}
      >
        {({ left }) => <CarouselCard left={left} review={review} />}
      </Motion>
    ))}
  </div>
);

MotionCarousel.propTypes = {
  reviews: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired,
};

export default MotionCarousel;
