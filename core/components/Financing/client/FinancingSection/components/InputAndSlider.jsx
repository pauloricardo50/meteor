// @flow
import React from 'react';
import cx from 'classnames';
import { AutoForm } from 'uniforms-material';
import SimpleSchema from 'simpl-schema';

import { compose, withProps } from 'recompose';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import { toMoney } from '../../../../../utils/conversionFunctions';

import InputAndSliderField from './InputAndSliderField';

type InputAndSliderProps = {
  value: number,
  updateStructure: Function,
  max?: number,
  className: string,
};

export const InputAndSlider = ({
  className,
  id,
  schema,
  value,
  updateStructure,
  ...props
}: InputAndSliderProps) => (
  <div className={cx('input-and-slider', className)}>
    <AutoForm
      onSubmit={updateStructure}
      schema={schema}
      model={{ [id]: value }}
      autosave
      autosaveDelay={500}
      disabled={props.structure.disableForms}
    >
      <InputAndSliderField name={id} {...props} />
    </AutoForm>
  </div>
);

export default compose(
  FinancingDataContainer,
  StructureUpdateContainer,
  withProps(
    ({
      max: _max,
      calculatePlaceholder,
      placeholder,
      id,
      allowUndefined,
      ...props
    }) => ({
      max: typeof _max === 'function' ? _max(props) : _max,
      placeholder: calculatePlaceholder
        ? toMoney(calculatePlaceholder(props))
        : placeholder,
      schema: new SimpleSchema({
        [id]: { type: Number, optional: allowUndefined },
      }),
    }),
  ),
)(InputAndSlider);
