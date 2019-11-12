// @flow
import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import { makeFilterConfig } from './FinancingSection/financingSectionHelpers';
import FinancingLabel from './FinancingLabel';
import FinancingDataContainer from './containers/FinancingDataContainer';

type FinancingLabelsProps = {
  config: Array<{ id: string, label: React.Node }>,
  className?: string,
  data: Object,
};

const renderLabel = configItem => {
  const { label, id } = configItem;
  if (!label) {
    return <T id={`Financing.${id}`} />;
  }

  if (typeof label === 'function') {
    const Label = label;
    return <Label {...configItem} />;
  }

  return label;
};

const FinancingLabels = ({
  config,
  className,
  ...data
}: FinancingLabelsProps) => (
  <div className={cx('financing-structures-labels', className)}>
    {config.filter(makeFilterConfig(data)).map((configItem, index) => (
      <FinancingLabel id={configItem.id} key={configItem.id || index}>
        {renderLabel(configItem)}
      </FinancingLabel>
    ))}
  </div>
);

export default FinancingDataContainer(FinancingLabels);
