import React, { useEffect, useReducer, useState } from 'react';
import Fab from '@material-ui/core/Fab';

import Icon from 'core/components/Icon';
import FormattedMessage from 'core/components/Translation/FormattedMessage';

import Button from '../Button';
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
    city,
    lotsCount,
    status,
    canton,
  } = promotion;

  const hasDescription = !!promotion.description;
  const descriptionIsTooLong = promotion.description?.length >= 250;
  const isFinished = status === 'FINISHED';

  const [showMore, setShowMore] = useState(false);
  const [description, setDescription] = useState();

  useEffect(() => {
    if (!hasDescription || !descriptionIsTooLong) {
      return;
    }

    const promotionDescription = promotion.description || '';
    if (!showMore) {
      setDescription([...promotionDescription.slice(0, 250), '...'].join(''));
    } else {
      setDescription(promotionDescription);
    }
  }, [showMore]);

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
        {isFinished && (
          <span className="promotion-item-images-finished">
            <FormattedMessage id="promotionFinished" />
          </span>
        )}
      </div>

      <div className="promotion-item-title">
        <h3 className="promotion-item-name">
          {name} - {city} ({canton})
        </h3>
        {!isFinished && <PromotionInterestForm promotion={promotion} />}
      </div>

      <span className="promotion-item-lots-count">
        <FormattedMessage id="promotionLotsCount" values={{ lotsCount }} />
      </span>

      {description && (
        <>
          <p className="promotion-item-description">{description}</p>
          {descriptionIsTooLong && (
            <Button
              primary
              onClick={() => setShowMore(s => !s)}
              size="small"
              className="show-more"
            >
              <FormattedMessage id={showMore ? 'less' : 'more'} />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default PromotionsGridItem;
