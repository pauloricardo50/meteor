// @flow
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';
import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';

const FinancingPropertyPickerContainer = compose(
  StructureUpdateContainer,
  SingleStructureContainer,
  connect(({ financing: { properties, loan: { _id: loanId } } }) => ({
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
      ...Object.values(properties).map(({ _id, address1 }) => ({
        id: _id,
        label: address1 || (
          <T id="FinancingPropertyPicker.placeholder" />
        ),
      })),
      {
        id: 'add',
        dividerTop: true,
        label: <T id="FinancingPropertyPicker.addProperty" />,
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

export default FinancingPropertyPickerContainer;
