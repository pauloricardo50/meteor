// @flow
import React from 'react';

import { Percent } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import Calculator from 'core/utils/Calculator';

type ProgressCellProps = {};

const ProgressCell = ({ loan }: ProgressCellProps) => (
  <div className="flex-row center">
    <Icon type="people" />
    <Percent value={Calculator.personalInfoPercent({ loan })} rounded />
    &nbsp;
    <Icon type="domain" />
    <Percent value={Calculator.propertyPercent({ loan })} rounded />
    &nbsp;
    <Icon type="attachFile" />
    <Percent value={Calculator.filesProgress({ loan })} rounded />
  </div>
);

export default ProgressCell;
