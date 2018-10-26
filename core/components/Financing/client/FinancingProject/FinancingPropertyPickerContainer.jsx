// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';

import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import { updateStructure } from '../../../../api';
import FinancingDataContainer from '../containers/FinancingDataContainer';

const FinancingPropertyPickerContainer = compose(
  FinancingDataContainer,
  SingleStructureContainer,
  withRouter,
  mapProps(({
    properties,
    loan: { _id: loanId },
    structure: { id: structureId, propertyId },
    history: { push },
  }) => ({
    options: [
      ...properties.map(({ _id, address1 }) => ({
        id: _id,
        label: address1 || <T id="FinancingPropertyPicker.placeholder" />,
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
        updateStructure.run({
          loanId,
          structureId,
          structure: {
            // Also reset propertyValue and notaryFees since it should not be the same
            propertyId: value,
            propertyValue: null,
            notaryFees: null,
          },
        });
      }
    },
  })),
);

export default FinancingPropertyPickerContainer;
