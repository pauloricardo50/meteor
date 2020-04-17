import React, { useRef, useState } from 'react';
import cx from 'classnames';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm } from 'uniforms-material';

import FinancingDataContainer from '../../containers/FinancingDataContainer';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingDateInput from './FinancingDateInput';

export const FinancingDateField = ({
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
        <FinancingDateInput name={id} formRef={formRef} {...props} />
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
      min,
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
            [id]: { type: Date, optional: true },
          }),
        ),
      );

      return {
        schema,
        handleSubmit: updateStructure,
      };
    },
  ),
)(FinancingDateField);
