//      
import React from 'react';

import {
  LENDER_RULES_VARIABLES,
  RESIDENCE_TYPE,
  CANTONS,
  PROPERTY_TYPE,
} from 'core/api/constants';
import MoneyInput from 'core/components/MoneyInput';
import RadioButtons from 'core/components/RadioButtons';
import { NumberField } from 'core/components/NumberInput';
import { PercentField } from 'core/components/PercentInput';
import CustomSelectField from 'core/components/AutoForm2/CustomSelectField';
import TextField from 'core/components/AutoForm2/CustomTextField';

                                    

const getSelectProps = variable => {
  if (variable === LENDER_RULES_VARIABLES.RESIDENCE_TYPE) {
    return {
      allowedValues: Object.values(RESIDENCE_TYPE),
      multiple: true,
      intlId: 'residenceType',
    };
  }

  if (variable === LENDER_RULES_VARIABLES.CANTON) {
    return {
      allowedValues: Object.keys(CANTONS),
      multiple: true,
      intlId: 'canton',
    };
  }

  if (variable === LENDER_RULES_VARIABLES.PROPERTY_TYPE) {
    return {
      allowedValues: Object.keys(PROPERTY_TYPE),
      multiple: true,
      intlId: 'propertyType',
    };
  }

  return { allowedValues: [] };
};

const LenderRulesFormValue = (props                           ) => {
  const { model, parent, onChange } = props;
  const index = Number(parent.name.slice(-1));
  const { variable } = model.rules[index];
  const shouldDisplay = !!variable;

  if (!shouldDisplay) {
    return null;
  }

  if (
    [
      LENDER_RULES_VARIABLES.INCOME,
      LENDER_RULES_VARIABLES.WANTED_LOAN,
      LENDER_RULES_VARIABLES.PROPERTY_VALUE,
      LENDER_RULES_VARIABLES.BANK_FORTUNE,
      LENDER_RULES_VARIABLES.REMAINING_BANK_FORTUNE,
    ].includes(variable)
  ) {
    return <MoneyInput {...props} />;
  }

  if ([LENDER_RULES_VARIABLES.INSIDE_AREA].includes(variable)) {
    return <NumberField {...props} />;
  }

  if ([LENDER_RULES_VARIABLES.BORROW_RATIO].includes(variable)) {
    return <PercentField {...props} />;
  }

  if ([LENDER_RULES_VARIABLES.ZIP_CODE].includes(variable)) {
    return (
      <TextField
        helperText="Indiquer plusieurs codes postaux séparés par un espace ou une virgule"
        {...props}
      />
    );
  }

  if ([LENDER_RULES_VARIABLES.IS_NEW_PROPERTY].includes(variable)) {
    return (
      <RadioButtons
        {...props}
        onChange={onChange}
        options={[
          { id: false, label: 'Faux' },
          { id: true, label: 'Vrai' },
        ]}
      />
    );
  }

  const selectProps = getSelectProps(variable);

  return (
    <CustomSelectField
      {...props}
      {...selectProps}
      displayEmpty={false}
      placeholder
      value={
        selectProps.multiple
          ? Array.isArray(props.value)
            ? props.value
            : []
          : props.value
      }
    />
  );
};

export default LenderRulesFormValue;
