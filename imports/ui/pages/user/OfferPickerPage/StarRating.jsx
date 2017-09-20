import React from 'react';
import PropTypes from 'prop-types';

import Star from 'material-ui/svg-icons/toggle/star';
import StarHalf from 'material-ui/svg-icons/toggle/star-half';
import StarEmpty from 'material-ui/svg-icons/toggle/star-border';

import StarRatingComponent from 'react-star-rating-component';
import colors from '/imports/js/config/colors';

const styles = {
  svg: {
    color: 'inherit',
  },
};

const StarRating = ({ value }) => (
  <StarRatingComponent
    name="rating"
    value={value}
    editing={false}
    starColor={colors.warning}
    emptyStarColor={colors.lightBorder}
    renderStarIcon={(index, val) =>
      (index <= val ? (
        <Star style={styles.svg} />
      ) : (
        <StarEmpty style={styles.svg} />
      ))}
    renderStarIconHalf={() => <StarHalf style={styles.svg} />}
  />
);

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
};

export default StarRating;
