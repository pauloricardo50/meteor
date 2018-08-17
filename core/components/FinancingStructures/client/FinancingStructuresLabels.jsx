// @flow
import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import { makeFilterConfig } from './FinancingStructuresSection/financingStructuresSectionHelpers';
import FinancingStructuresLabel from './FinancingStructuresLabel';
import FinancingStructuresDataContainer from './containers/FinancingStructuresDataContainer';

type FinancingStructureLabelsProps = {
  config: Array<{ id: string, label: React.Node }>,
  className?: string,
  data: Object,
};

const renderLabel = (configItem) => {
  const { label, id } = configItem;
  if (!label) {
    return <T id={`FinancingStructures.${id}`} />;
  }

  if (typeof label === 'function') {
    const Label = label;
    return <Label {...configItem} />;
  }

  return label;
};

const FinancingStructuresLabels = ({
  config,
  className,
  ...data
}: FinancingStructureLabelsProps) => (
  <div className={cx('financing-structures-labels', className)}>
    {config.filter(makeFilterConfig(data)).map(configItem => (
      <FinancingStructuresLabel id={configItem.id} key={configItem.id}>
        {renderLabel(configItem)}
      </FinancingStructuresLabel>
    ))}
  </div>
);

export default FinancingStructuresDataContainer({ asArrays: true })(FinancingStructuresLabels);
