// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
  withRouter,
  mapProps(({
    properties,
    loanId,
    structure: { propertyId },
    handleChange,
    history: { push },
  }) => ({
    options: [
      ...Object.values(properties).map(({ _id, address1, value }) => ({
        id: _id,
        label: address1,
      })),
      {
        id: 'add',
        dividerTop: true,
        label: <T id="FinancingStructuresPropertyPicker.addProperty" />,
      },
    ],
    value: propertyId,
    property: properties[propertyId],
    handleChange: (_, value) => {
      if (value === 'add') {
        push(`/loans/${loanId}/properties`);
      } else {
        handleChange(value);
      }
    },
  })),
);

export default FinancingStructuresPropertyPickerContainer;
