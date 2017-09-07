import React from 'react';
import PropTypes from 'prop-types';

import DialogSimple from '/imports/ui/components/general/DialogSimple';
import Slider from '/imports/ui/components/general/Slider';
import RadioButtons from '/imports/ui/components/general/RadioButtons';
import { T } from '/imports/ui/components/general/Translation';

import FieldToggles from './FieldToggles';

const AdvancedOptions = ({
  comparator,
  changeComparator,
  toggleField,
  allFields,
  removeCustomField,
}) =>
  (<div className="flex-col center">
    <hr style={{ width: '100%' }} />

    <div className="flex-col" style={{ width: '100%', maxWidth: 400 }}>
      <Slider
        label={<T id="AdvancedOptions.borrowRatio" />}
        id="borrowRatio"
        min={0}
        max={comparator.usageType === 'secondary' ? 0.7 : 0.8}
        step={0.01}
        currentValue={comparator.borrowRatio}
        handleChange={changeComparator}
        labelMin="0%"
        labelMax={comparator.usageType === 'secondary' ? '70%' : '80%'}
      />
    </div>

    <RadioButtons
      options={['primary', 'secondary', 'investment']}
      label={<T id="Forms.usageType" />}
      id="usageType"
      handleChange={changeComparator}
      currentValue={comparator.usageType}
      intlPrefix="Forms"
    />

    <DialogSimple
      label={<T id="FieldToggles.label" />}
      title={<T id="FieldToggles.title" />}
      primary
      autoScroll
      buttonStyle={{ marginTop: 20 }}
    >
      <FieldToggles
        toggleField={toggleField}
        allFields={allFields}
        hiddenFields={comparator.hiddenFields}
        removeCustomField={removeCustomField}
      />
    </DialogSimple>
  </div>);

AdvancedOptions.propTypes = {
  comparator: PropTypes.objectOf(PropTypes.any).isRequired,
  changeComparator: PropTypes.func.isRequired,
  toggleField: PropTypes.func.isRequired,
  allFields: PropTypes.array.isRequired,
  removeCustomField: PropTypes.func.isRequired,
};

export default AdvancedOptions;
