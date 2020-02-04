//      
import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';

                         
                   
  

const BorrowerAge = ({ borrower }                  ) => {
  const { age } = borrower;
  const isNearRetirement = age > 49;

  return age ? (
    <h4
      className={cx('flex-row center', {
        'warning-box': isNearRetirement,
        'p-16': isNearRetirement,
        animated: isNearRetirement,
        shake: isNearRetirement,
      })}
    >
      {isNearRetirement && (
        <Icon
          type="warning"
          tooltip="Proche de la retraite"
          style={{ marginRight: '8px' }}
        />
      )}
      <T id="SingleBorrowerPageHeader.age" values={{ value: age }} />
    </h4>
  ) : null;
};

export default BorrowerAge;
