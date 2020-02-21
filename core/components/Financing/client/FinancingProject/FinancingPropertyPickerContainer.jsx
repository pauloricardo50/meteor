import React, { useState } from 'react';
import { compose, mapProps } from 'recompose';

import { propertyInsert } from 'core/api/properties/methodDefinitions';
import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import { updateStructure } from '../../../../api';
import FinancingDataContainer from '../containers/FinancingDataContainer';

const FinancingPropertyPickerContainer = compose(
  FinancingDataContainer,
  SingleStructureContainer,
  mapProps(
    ({
      properties = [],
      promotionOptions = [],
      loan: { _id: loanId, userId },
      structure: {
        id: structureId,
        propertyId,
        promotionOptionId,
        disableForms,
      },
    }) => {
      const [openForm, setOpenForm] = useState();

      const handleChange = value => {
        if (value === 'add') {
          setOpenForm(true);
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
      };

      return {
        openForm,
        setOpenForm,
        disabled: disableForms,
        options: [
          ...properties.map(({ _id, address, propertyType }) => ({
            id: _id,
            label: (
              <span style={{ maxWidth: 200, whiteSpace: 'pre-wrap' }}>
                {address.replace(', ', '\n')}
              </span>
            ) || <T id="FinancingPropertyPicker.placeholder" />,
            secondary: propertyType && (
              <T id={`Forms.propertyType.${propertyType}`} />
            ),
          })),
          ...promotionOptions.map(({ _id, name }) => ({
            id: _id,
            label: (
              <T
                id="FinancingPropertyPicker.promotionOption"
                values={{ name }}
              />
            ),
          })),
          {
            id: 'add',
            dividerTop: true,
            label: <T id="FinancingPropertyPicker.addProperty" />,
          },
        ],
        value: propertyId || promotionOptionId,
        handleChange,
        handleAddProperty: values =>
          propertyInsert
            .run({ property: values, loanId, userId })
            .then(newId => {
              handleChange(newId);
              setOpenForm(false);
            }),
      };
    },
  ),
);

export default FinancingPropertyPickerContainer;
