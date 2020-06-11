import React, { useMemo } from 'react';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import SimpleSchema from 'simpl-schema';

import { updateStructure } from 'core/api/loans/methodDefinitions';
import { structureSchema } from 'core/api/loans/schemas/StructureSchema';
import AutoForm from 'core/components/AutoForm2';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';

const getSchema = loan => {
  const offers = Calculator.selectOffers({ loan });

  return new SimpleSchema(
    merge(
      {},
      pick(structureSchema, [
        'propertyValue',
        'wantedLoan',
        'notaryFees',
        'ownFunds',
        'ownFunds.$',
        'ownFunds.$.value',
        'ownFunds.$.description',
      ]),
      {
        propertyValue: {
          uniforms: { label: "Valeur de l'objet", placeholder: 0 },
        },
        wantedLoan: { uniforms: { label: 'Dette', placeholder: 0 } },
        notaryFees: { uniforms: { label: 'Frais', placeholder: 0 } },
        ownFunds: { uniforms: { label: 'Autres Fonds' } },
        'ownFunds.$.value': { uniforms: { label: 'Montant', placeholder: 0 } },
        'ownFunds.$.description': {
          uniforms: { label: 'Description', placeholder: '' },
        },
        offerId: {
          type: String,
          optional: true,
          allowedValues: offers.map(({ _id }) => _id),
          uniforms: {
            label: 'Offre choisie',
            placeholder: 'Aucune',
            nullable: true,
            transform: offerId => {
              if (offerId) {
                const offer = offers.find(({ _id }) => _id);
                const { organisation } = Calculator.selectLenderForOfferId({
                  loan,
                  offerId: offer._id,
                });
                return `${organisation.name} - CHF ${toMoney(offer.maxAmount)}`;
              }
            },
          },
        },
      },
    ),
  );
};

const StructureForm = ({ loan }) => {
  const { structure, _id, selectedStructure, borrowers } = loan;
  const schema = useMemo(() => getSchema(loan), []);

  const normalizedModel = structure.offerId
    ? structure
    : { ...structure, offerId: null };

  return (
    <div>
      <AutoForm
        schema={schema}
        model={normalizedModel}
        onSubmit={newStructure => {
          const [borrower] = borrowers;

          // Apply the first borrower's id to all own funds, that way if
          // this loan ever starts to use regular structures, it still works
          if (newStructure.ownFunds) {
            newStructure.ownFunds = newStructure.ownFunds.map(item => ({
              ...item,
              borrowerId: borrower._id,
            }));
          }

          return updateStructure.run({
            structure: newStructure,
            loanId: _id,
            structureId: selectedStructure,
          });
        }}
      />
    </div>
  );
};

export default StructureForm;
