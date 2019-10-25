// @flow
import React from 'react';

import DialogSimple from 'core/components/DialogSimple';
import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton/IconButton';
import AutoForm, { CustomAutoField } from 'imports/core/components/AutoForm2';
import { ORGANISATION_TAGS } from 'core/api/constants';
import LenderPickerContainer from './LenderPickerContainer';
import LenderPickerOrganisation from './LenderPickerOrganisation';

type LenderPickerProps = {
  organisations: Array<Object>,
  count: Number,
  loan: Object,
  addLender: Function,
  removeLender: Function,
  tagPickerSchema: Object,
  filterOrganisations: Function,
};

const addAllLendersOfType = ({ organisations, type, addLender }) => () =>
  organisations[type].forEach(({ _id }) => addLender(_id));
const isActive = ({ loan, org }) =>
  loan.lenders.find(({ organisation }) => organisation && organisation._id === org._id);

const LenderPicker = ({
  organisations,
  count,
  loan,
  addLender,
  removeLender,
  tagPickerSchema,
  filterOrganisations,
}: LenderPickerProps) => (
  <DialogSimple
    label="Choisir prêteurs"
    closeOnly
    primary
    buttonProps={{ style: { marginRight: 8 } }}
    onClose={() => filterOrganisations({ tags: [] })}
  >
    <div className="lender-picker-dialog">
      <h2>Choisir prêteurs</h2>
      {count === 0 && (
        <h1 className="secondary">
          Pas de prêteurs, ajouter un prêteur en donnant cette fonctionalité à
          une organisation.
        </h1>
      )}
      <AutoForm
        schema={tagPickerSchema}
        onSubmit={filterOrganisations}
        autosave
        model={{ tags: [ORGANISATION_TAGS.CH_RETAIL] }}
      >
        <CustomAutoField name="tags" />
      </AutoForm>
      {Object.keys(organisations).map(type => (
        <div key={type}>
          <div className="lender-picker-dialog-type">
            <h3>
              <T id={`Forms.type.${type}`} />
            </h3>
            {organisations[type].every(org => !isActive({ loan, org })) && (
              <IconButton
                tooltip="Tout choisir"
                className="success"
                type="add"
                onClick={addAllLendersOfType({
                  organisations,
                  type,
                  addLender,
                })}
              />
            )}
          </div>
          {organisations[type].map(org => (
            <LenderPickerOrganisation
              key={org._id}
              organisation={org}
              addLender={addLender}
              removeLender={removeLender}
              isActive={isActive({ loan, org })}
              loan={loan}
            />
          ))}
        </div>
      ))}
    </div>
  </DialogSimple>
);

export default LenderPickerContainer(LenderPicker);
