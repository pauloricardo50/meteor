import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';
import { compose, mapProps } from 'recompose';

import { updateStructure } from '../../../../api/loans/methodDefinitions';
import { propertyInsert } from '../../../../api/properties/methodDefinitions';
import T, { Money } from '../../../Translation';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';

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
          ...properties.map(({ _id, address, propertyType, value }) => ({
            id: _id,
            label: (
              <span style={{ maxWidth: 200, whiteSpace: 'pre-wrap' }}>
                {address.replace(', ', '\n')}
              </span>
            ) || <T id="FinancingPropertyPicker.placeholder" />,
            secondary: <Money value={value} />,
            description: propertyType && (
              <T id={`Forms.propertyType.${propertyType}`} />
            ),
          })),
          ...promotionOptions.map(
            ({ _id, name, promotion: { name: promotionName }, value }) => ({
              id: _id,
              label: (
                <T
                  id="FinancingPropertyPicker.promotionOption"
                  values={{ name }}
                />
              ),
              secondary: <Money value={value} />,
              description: (
                <span style={{ maxWidth: 200, whiteSpace: 'pre-wrap' }}>
                  {promotionName}
                </span>
              ),
            }),
          ),
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
            .run({
              property: values,
              loanId,
              userId: Meteor.microservice === 'admin' ? userId : undefined,
            })
            .then(newId => {
              handleChange(newId);
              setOpenForm(false);
            }),
      };
    },
  ),
);

export default FinancingPropertyPickerContainer;
