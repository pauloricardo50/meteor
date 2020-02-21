import React, { useRef, useState } from 'react';
import cx from 'classnames';
import { AutoForm } from 'uniforms-material';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import { compose, withProps } from 'recompose';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import { toMoney } from '../../../../../utils/conversionFunctions';

import FinancingInput from './FinancingInput';

export const FinancingField = ({
  className,
  id,
  schema,
  value,
  updateStructure,
  ...props
}) => {
  const formRef = useRef(null);
  return (
    <div className={cx('financing-field', className)}>
      <AutoForm
        onSubmit={updateStructure}
        schema={schema}
        model={{ [id]: value }}
        disabled={props.structure.disableForms}
        ref={formRef}
      >
        <FinancingInput name={id} formRef={formRef} {...props} />
      </AutoForm>
    </div>
  );
};

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
    }) => {
      // The schema never changes
      const [schema] = useState(
        new SimpleSchema2Bridge(
          new SimpleSchema({
            [id]: { type: Number, optional: allowUndefined },
          }),
        ),
      );

      return {
        max: typeof _max === 'function' ? _max(props) : _max,
        placeholder: calculatePlaceholder
          ? toMoney(calculatePlaceholder(props))
          : placeholder,
        schema,
      };
    },
  ),
)(FinancingField);
