// @flow
import React from 'react';

import { PROMOTION_OPTION_SOLVENCY } from '../../api/constants';
import Icon from '../Icon';
import Tooltip from '../Material/Tooltip';

type PromotionOptionSolvencyProps = {};

const PromotionOptionSolvency = ({
  solvency,
}: PromotionOptionSolvencyProps) => {
  let tooltip = 'Solvabilité à déterminer';
  let icon = 'help';

  switch (solvency) {
  case PROMOTION_OPTION_SOLVENCY.SOLVENT:
    tooltip = 'Solvable';
    icon = 'check';
    break;
  case PROMOTION_OPTION_SOLVENCY.INSOLVENT:
    tooltip = 'Non solvable';
    icon = 'close';
    break;

  default:
    break;
  }

  return (
    <Tooltip title={tooltip} className="icon" enterTouchDelay={0}>
      <Icon type={icon} />
    </Tooltip>
  );
};
export default PromotionOptionSolvency;
