import './PromotionsGrid.scss';

import React, { useEffect, useState } from 'react';
import { faInbox } from '@fortawesome/pro-light-svg-icons/faInbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loading from 'core/components/Loading';
import FormattedMessage from 'core/components/Translation/FormattedMessage';

import meteorClient from '../../utils/meteorClient';
import CantonFilter from './CantonFilter';
import PromotionsGridItem from './PromotionGridItem';

const PromotionsGrid = () => {
  const [promotions, setPromotions] = useState();
  const [cantons, setCantons] = useState();
  const [canton, setCanton] = useState([null]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    meteorClient
      .call('named_query_PROMOTIONS_LIST', {
        canton: canton.filter(x => x).length > 0 ? canton : undefined,
      })
      .then(res => {
        setPromotions([
          ...res.filter(({ status }) => status === 'OPEN'),
          ...res.filter(({ status }) => status === 'FINISHED'),
        ]);

        if (!cantons) {
          setCantons(new Set([...res.map(({ canton: c }) => c)]));
        }

        return res;
      })
      .finally(() => setLoading(false));
  }, [canton]);

  return (
    <div className="promotions container">
      {loading ? (
        <Loading />
      ) : promotions?.length ? (
        <div className="promotions-grid">
          <div className="promotions-filters">
            <CantonFilter
              canton={canton}
              setCanton={setCanton}
              cantons={cantons}
            />
          </div>
          {promotions.map(promotion => (
            <PromotionsGridItem key={promotion.id} promotion={promotion} />
          ))}
        </div>
      ) : (
        <div className="secondary flex-col center">
          <FontAwesomeIcon
            icon={faInbox}
            size="4x"
            style={{ padding: 16, paddingBottom: 4 }}
          />
          <span className="font-size-3">
            <FormattedMessage id="noResult" />
          </span>
        </div>
      )}
    </div>
  );
};

export default PromotionsGrid;
