import React from 'react';
import PropTypes from 'prop-types';

import StarRatingComponent from 'react-star-rating-component';
import colors from '../../config/colors';
import Icon from '../Icon';

const styles = {
  svg: { color: 'inherit' },
};

const StarRating = ({ value }) => (
  <StarRatingComponent
    className="star-rating-flex star-rating"
    name="rating"
    value={value}
    editing={false}
    starColor={colors.warning}
    emptyStarColor={colors.borderGrey}
    renderStarIcon={(index, val) =>
      (index <= val ? (
        <Icon type="star" style={styles.svg} />
      ) : (
        <Icon type="starEmpty" style={styles.svg} />
      ))
    }
    renderStarIconHalf={() => <Icon type="starHalf" style={styles.svg} />}
  />
);

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
};

export default StarRating;
