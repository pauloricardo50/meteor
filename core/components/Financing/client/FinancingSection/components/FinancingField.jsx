import React, { useMemo, useRef } from 'react';
import cx from 'classnames';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm } from 'uniforms-material';

import FinancingDataContainer from '../../containers/FinancingDataContainer';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
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
      min,
      calculatePlaceholder,
      placeholder,
      id,
      allowUndefined,
      updateStructure,
      type,
      ...props
    }) => {
      // The schema never changes
      const schema = useMemo(
        () =>
          new SimpleSchema2Bridge(
            new SimpleSchema({
              [id]: {
                type: type === 'text' ? String : Number,
                optional: allowUndefined,
              },
            }),
          ),
        [],
      );

      return {
        max: typeof max === 'function' ? max(props) : max,
        min: typeof min === 'function' ? min(props) : min,
        placeholder: calculatePlaceholder
          ? calculatePlaceholder(props)
          : placeholder,
        schema,
        handleSubmit: updateStructure,
      };
    },
  ),
)(FinancingField);
