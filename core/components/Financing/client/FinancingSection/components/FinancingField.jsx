import React, { useRef, useState } from 'react';
import cx from 'classnames';
import { AutoForm } from 'uniforms-material';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { compose, withProps } from 'recompose';

import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import FinancingInput from './FinancingInput';

export const FinancingField = ({
  className,
  id,
  schema,
  value,
  handleSubmit,
  ...props
}) => {
  const formRef = useRef(null);
  return (
    <div className={cx('financing-field', className)}>
      <AutoForm
        onSubmit={handleSubmit}
        schema={schema}
        model={{ [id]: value }}
        disabled={props.structure?.disableForms}
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
      max,
      calculatePlaceholder,
      placeholder,
      id,
      allowUndefined,
      updateStructure,
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
        max: typeof max === 'function' ? max(props) : max,
        placeholder: calculatePlaceholder
          ? calculatePlaceholder(props)
          : placeholder,
        schema,
        handleSubmit: updateStructure,
      };
    },
  ),
)(FinancingField);
