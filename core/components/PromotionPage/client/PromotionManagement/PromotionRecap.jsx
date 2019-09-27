// @flow
import React from 'react';
import Recap from 'core/components/Recap/Recap';
import PromotionRecapContainer from './PromotionRecapContainer';

type PromotionRecapProps = {
  recapArray: Array,
};

const PromotionRecap = ({ recapArray }: PromotionRecapProps) => (
  <div className="promotion-recap">
    <Recap arrayName="custom" recapArray={recapArray} />
  </div>
);

export default PromotionRecapContainer(PromotionRecap);
