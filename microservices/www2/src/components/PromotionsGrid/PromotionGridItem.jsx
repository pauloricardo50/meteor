import React, { useReducer } from 'react';
import Fab from '@material-ui/core/Fab';

import Icon from 'core/components/Icon';
import FormattedMessage from 'core/components/Translation/FormattedMessage';

import PromotionInterestForm from './PromotionInterestForm';

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
    lotsCount,
    status,
    canton,
  } = promotion;

  const reducer = makeReducer({ images });
  const [{ id }, dispatch] = useReducer(reducer, { id: 0 });

  return (
    <div className="promotion-item">
      <div
        key="promo-img"
        className="promotion-item-images"
        style={{ backgroundImage: `url("${images[id]?.url}")` }}
      >
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

      <div className="promotion-item-title">
        <h3 className="promotion-item-name">
          {name} - {city} ({canton})
        </h3>
        {status !== 'FINISHED' && (
          <PromotionInterestForm promotion={promotion} />
        )}
      </div>

      <span className="promotion-item-lots-count">
        <FormattedMessage id="promotionLotsCount" values={{ lotsCount }} />
      </span>

      {description && <p className="promotion-item-summary">{description}</p>}
    </div>
  );
};

export default PromotionsGridItem;
