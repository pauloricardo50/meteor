// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';

const FinancingStructuresPropertyPickerContainer = compose(
  StructureUpdateContainer,
  SingleStructureContainer,
  connect(({ financingStructures: { properties, loan: { _id: loanId } } }) => ({
    properties,
    loanId,
  })),
  mapProps(({ properties, loanId, structure: { propertyId }, handleChange }) => ({
    options: [
      ...Object.values(properties).map(({ _id, address1, value }) => ({
        id: _id,
        label: address1,
        secondary: `CHF ${toMoney(value)}`,
      })),
      {
        id: 'add',
        dividerTop: true,
        link: `/loans/${loanId}/properties`,
        label: <T id="FinancingStructuresPropertyPicker.addProperty" />,
      },
    ],
    value: propertyId,
    property: properties[propertyId],
    handleChange: (_, value) => value && handleChange(value),
  })),
);

export default FinancingStructuresPropertyPickerContainer;
