//      
import React from 'react';
import cx from 'classnames';

                          
                 
  

const PremiumBadge = ({ small = false }                   ) => (
  <span className={cx('premium-badge', { small })}>Premium</span>
);

export default PremiumBadge;
