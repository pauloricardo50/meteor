import React from 'react';
import PropTypes from 'prop-types';

import DialogSimple from '/imports/ui/components/general/DialogSimple.jsx';
import Slider from '/imports/ui/components/general/Slider.jsx';
import RadioButtons from '/imports/ui/components/general/RadioButtons.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

import FieldToggles from './FieldToggles.jsx';

const AdvancedOptions = ({
  options,
  changeOptions,
  toggleField,
  allFields,
  hiddenFields,
}) =>
  (<div className="flex-col center">
    <hr />

    <div className="flex-col" style={{ width: '100%', maxWidth: 400 }}>
      <Slider
        label={<T id="AdvancedOptions.borrowRatio" />}
        id="borrowRatio"
        min={0}
        max={options.usageType === 'secondary' ? 0.7 : 0.8}
        step={0.01}
        currentValue={options.borrowRatio}
        handleChange={changeOptions}
        labelMin="0%"
        labelMax={options.usageType === 'secondary' ? '70%' : '80%'}
      />
    </div>

    <RadioButtons
      options={['primary', 'secondary', 'investment']}
      label={<T id="Forms.usageType" />}
      id="usageType"
      handleChange={changeOptions}
      currentValue={options.usageType}
      intlPrefix="Forms"
    />

    <DialogSimple
      label={<T id="FieldToggles.label" />}
      title={<T id="FieldToggles.title" />}
      primary
      autoScroll
    >
      <FieldToggles
        toggleField={toggleField}
        allFields={allFields}
        hiddenFields={hiddenFields}
      />
    </DialogSimple>
  </div>);

AdvancedOptions.propTypes = {
  options: PropTypes.objectOf(PropTypes.any).isRequired,
  changeOptions: PropTypes.func.isRequired,
  toggleField: PropTypes.func.isRequired,
  allFields: PropTypes.array.isRequired,
  hiddenFields: PropTypes.array.isRequired,
};

export default AdvancedOptions;
