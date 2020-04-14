import React from 'react';
import cx from 'classnames';

import T from '../../Translation';
import FinancingDataContainer from './containers/FinancingDataContainer';
import FinancingLabel from './FinancingLabel';
import { makeFilterConfig } from './FinancingSection/financingSectionHelpers';

const renderLabel = configItem => {
  const { label, id, intlProps } = configItem;
  if (!label) {
    return <T id={`Financing.${id}`} {...intlProps} />;
  }

  if (typeof label === 'function') {
    const Label = label;
    return <Label {...configItem} />;
  }

  return label;
};

const FinancingLabels = ({ config, className, ...data }) => (
  <div className={cx('financing-structures-labels', className)}>
    {config.filter(makeFilterConfig(data)).map((configItem, index) => (
      <FinancingLabel id={configItem.id} key={configItem.id || index}>
        {renderLabel(configItem)}
      </FinancingLabel>
    ))}
  </div>
);

export default FinancingDataContainer(FinancingLabels);
