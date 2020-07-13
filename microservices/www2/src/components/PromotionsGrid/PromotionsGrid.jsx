import './PromotionsGrid.scss';

import React, { useEffect, useState } from 'react';
import { faInbox } from '@fortawesome/pro-light-svg-icons/faInbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loading from 'core/components/Loading';
import FormattedMessage from 'core/components/Translation/FormattedMessage';
import useMedia from 'core/hooks/useMedia';
import useWindowSize from 'core/hooks/useWindowSize';

import meteorClient from '../../utils/meteorClient';
import CantonFilter from './CantonFilter';
import PromotionsGridItem from './PromotionGridItem';

const PromotionsGrid = () => {
  const [promotions, setPromotions] = useState();
  const [cantons, setCantons] = useState();
  const [canton, setCanton] = useState([null]);
  const [loading, setLoading] = useState(false);
  const isWide = useMedia({ maxWidth: 1200 });
  const isMed = useMedia({ maxWidth: 768 });
  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    setLoading(true);
    meteorClient
      .call('named_query_PROMOTIONS_LIST', {
        canton: canton.filter(x => x).length > 0 ? canton : undefined,
      })
      .then(res => {
        setLoading(false);
        setPromotions([
          ...res.filter(({ status }) => status === 'OPEN'),
          ...res.filter(({ status }) => status === 'FINISHED'),
        ]);

        if (!cantons) {
          setCantons(new Set([...res.map(({ canton: c }) => c)]));
        }

        return res;
      })
      .catch(error => {
        setLoading(false);
        throw error;
      });
  }, [canton]);

  return (
    <div className="promotions container">
      <div className="promotions-grid">
        <div className="promotions-filters">
          <CantonFilter
            canton={canton}
            setCanton={setCanton}
            cantons={cantons}
          />
        </div>
        {loading && !promotions?.length && (
          <Loading className="promotions-loading" />
        )}
        {promotions?.map(promotion => (
          <PromotionsGridItem
            key={promotion.id}
            promotion={promotion}
            loading={loading}
            w={{ isWide, isMed, windowWidth }}
          />
        ))}
        {!loading && !promotions?.length && (
          <div className="secondary flex-col center promotions-no-result">
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
    </div>
  );
};

export default PromotionsGrid;
