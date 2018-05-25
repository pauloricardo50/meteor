import React from 'react';
import PropTypes from 'prop-types';

import { TOOLTIP_LISTS } from '../../arrays/tooltips';

const { Provider, Consumer } = React.createContext();

export const TooltipProvider = ({ tooltipList, children }) => (
  <Provider value={tooltipList}>{children}</Provider>
);

export const TooltipContainer = Component => props => (
  <Consumer>
    {tooltipList => <Component tooltipList={tooltipList} {...props} />}
  </Consumer>
);

TooltipProvider.propTypes = {
  tooltipList: PropTypes.string,
  children: PropTypes.node.isRequired,
};

TooltipProvider.defaultProps = {
  tooltipList: TOOLTIP_LISTS.GENERAL,
};
