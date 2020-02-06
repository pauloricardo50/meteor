//
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
  mapProps(
    ({
      properties = [],
      promotionOptions = [],
      loan: { _id: loanId },
      structure: {
        id: structureId,
        propertyId,
        promotionOptionId,
        disableForms,
      },
      history: { push },
    }) => ({
      disabled: disableForms,
      options: [
        ...properties.map(({ _id, address1 }) => ({
          id: _id,
          label: address1 || <T id="FinancingPropertyPicker.placeholder" />,
        })),
        ...promotionOptions.map(({ _id, name }) => ({
          id: _id,
          label: (
            <T id="FinancingPropertyPicker.promotionOption" values={{ name }} />
          ),
        })),
        {
          id: 'add',
          dividerTop: true,
          label: <T id="FinancingPropertyPicker.addProperty" />,
        },
      ],
      value: propertyId || promotionOptionId,
      handleChange: value => {
        if (value === 'add') {
          push(`/loans/${loanId}/properties`);
        } else {
          const isPromotionOption = promotionOptions
            .map(({ _id }) => _id)
            .includes(value);
          updateStructure.run({
            loanId,
            structureId,
            structure: {
              // Also reset propertyValue and notaryFees since it should not be the same
              propertyId: isPromotionOption ? null : value,
              promotionOptionId: isPromotionOption ? value : null,
              propertyValue: null,
              notaryFees: null,
            },
          });
        }
      },
    }),
  ),
);

export default FinancingPropertyPickerContainer;
