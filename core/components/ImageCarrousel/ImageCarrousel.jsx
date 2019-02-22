// @flow
import React, { useReducer } from 'react';
import cx from 'classnames';
import Fab from '@material-ui/core/Fab';

import Icon from '../Icon';

type ImageCarrouselProps = {};

const initialState = { index: 0 };

const makeReducer = maxLength => (state, action) => {
  switch (action.type) {
  case 'increment': {
    const nextIndex = state.index + 1;
    return { index: nextIndex >= maxLength ? 0 : nextIndex };
  }
  case 'decrement': {
    const nextIndex = state.index - 1;
    return { index: nextIndex < 0 ? maxLength - 1 : nextIndex };
  }
  default:
    return state;
  }
};

const ImageCarrousel = ({ images, className }: ImageCarrouselProps) => {
  const hasMultipleImages = images.length > 1;
  const [state, dispatch] = useReducer(
    makeReducer(images.length),
    initialState,
  );

  return (
    <div
      style={{ backgroundImage: `url("${images[state.index]}")` }}
      className={cx('image-carrousel', className)}
    >
      {hasMultipleImages && (
        <>
          <Fab
            className="increment"
            onClick={() => dispatch({ type: 'increment' })}
            color="primary"
          >
            <Icon type="left" />
          </Fab>
          <Fab
            className="decrement"
            onClick={() => dispatch({ type: 'decrement' })}
            color="primary"
          >
            <Icon type="right" />
          </Fab>
        </>
      )}
    </div>
  );
};

export default ImageCarrousel;
