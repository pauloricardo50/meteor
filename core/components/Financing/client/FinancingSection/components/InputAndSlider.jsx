//
import React from 'react';
import cx from 'classnames';
import { AutoForm } from 'uniforms-material';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import { compose, withProps } from 'recompose';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import { toMoney } from '../../../../../utils/conversionFunctions';

import InputAndSliderField from './InputAndSliderField';

export const InputAndSlider = ({
  className,
  id,
  schema,
  value,
  updateStructure,
  ...props
}) => (
  <div className={cx('input-and-slider', className)}>
    <AutoForm
      onSubmit={updateStructure}
      schema={new SimpleSchema2Bridge(schema)}
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
