import React from 'react';

import Recap from '../../../Recap';
import PromotionRecapContainer from './PromotionRecapContainer';

const PromotionRecap = ({ recapArray }) => (
  <div className="promotion-recap">
    <Recap arrayName="custom" recapArray={recapArray} />
  </div>
);

export default PromotionRecapContainer(PromotionRecap);
