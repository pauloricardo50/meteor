import React, { useReducer } from 'react';
import Fab from '@material-ui/core/Fab';

import Icon from 'core/components/Icon';
import FormattedMessage from 'core/components/Translation/FormattedMessage';

import Button from '../Button';

const makeReducer = ({ images }) => (state, action) => {
  const { id } = state;
  const next = id === images.length - 1 ? 0 : id + 1;
  const prev = id === 0 ? images.length - 1 : id - 1;

  switch (action.type) {
    case 'next':
      return { id: next };
    case 'prev':
      return { id: prev };
    default:
      return state;
  }
};

const PromotionsGridItem = ({ promotion }) => {
  const {
    name,
    documents: { promotionImage: images } = {},
    description,
    city,
    canton,
    lotsCount,
    address,
    status,
  } = promotion;

  const reducer = makeReducer({ images });
  const [{ id }, dispatch] = useReducer(reducer, { id: 0 });

  return (
    <div className="promotion-item">
      {/* TODO: add slider for multiple images */}

      <div className="promotion-item-images">
        {images.map((image, i) => (
          <img
            key={image.name}
            src={image.url}
            alt={`${name}_${image.name}`}
            style={{ display: i === id ? 'block' : 'none' }}
          />
        ))}
        {images?.length > 1 && (
          <>
            <Fab
              onClick={() => dispatch({ type: 'prev' })}
              color="primary"
              size="small"
              className="promotion-item-images-previous"
            >
              <Icon type="left" />
            </Fab>
            <Fab
              onClick={() => dispatch({ type: 'next' })}
              color="primary"
              size="small"
              className="promotion-item-images-next"
            >
              <Icon type="right" />
            </Fab>
          </>
        )}
        {status === 'FINISHED' && (
          <span className="promotion-item-images-finished">
            <FormattedMessage id="promotionFinished" />
          </span>
        )}
      </div>

      <h3 className="promotion-item-name">
        {name} - {city}
      </h3>

      <span className="promotion-item-lots-count">
        <FormattedMessage id="promotionLotsCount" values={{ lotsCount }} />
      </span>

      {description && <p className="promotion-item-summary">{description}</p>}

      <div>
        <div className="interest-button">
          <Button raised className="button" type="submit">
            <FormattedMessage id="promoInterest" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionsGridItem;
