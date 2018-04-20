import React from 'react';
import PropTypes from 'prop-types';

import DialogSimple from 'core/components/DialogSimple';

const MAX_LENGTH = 160;

const CarouselCardText = ({ name, title, text }) => {
  const showExtraTextInDialog = text.length > MAX_LENGTH;

  if (showExtraTextInDialog) {
    return (
      <p className="carousel-card-text">
        {text.slice(0, MAX_LENGTH)}...{' '}
        <DialogSimple
          label="Afficher plus"
          buttonProps={{ style: { marginTop: 16 }, raised: false }}
          cancelOnly
        >
          <h3>{name}</h3>
          <h4>{title}</h4>
          <p>{text}</p>
        </DialogSimple>
      </p>
    );
  }

  return <p className="carousel-card-text">{text}</p>;
};

CarouselCardText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CarouselCardText;
