import React from 'react';

import { ORGANISATION_TAGS } from 'core/api/organisations/organisationConstants';
import Checkbox from 'core/components/Checkbox';
import DialogSimple from 'core/components/DialogSimple';
import Select from 'core/components/Select';
import T from 'core/components/Translation';

import LenderPickerContainer from './LenderPickerContainer';
import LenderPickerOrganisation from './LenderPickerOrganisation';

const isActive = ({ loan, org }) =>
  loan.lenders.find(({ organisation }) => organisation?._id === org._id);

const LenderPicker = ({
  organisations,
  count,
  loan,
  addLender,
  removeLender,
  tags,
  setTags,
  filterOrganisations,
  hasRules,
  setHasRules,
}) => (
  <DialogSimple
    label="Choisir prêteurs"
    closeOnly
    primary
    buttonProps={{ style: { marginRight: 8 } }}
    onClose={() => filterOrganisations({ tags: [] })}
    title="Choisir prêteurs"
  >
    <div className="lender-picker-dialog">
      {count === 0 && (
        <h1 className="secondary">
          Pas de prêteurs, ajouter un prêteur en donnant cette fonctionalité à
          une organisation.
        </h1>
      )}

      <div className="flex center-align">
        <Select
          value={tags}
          onChange={setTags}
          multiple
          label="Tags"
          options={Object.values(ORGANISATION_TAGS).map(tag => ({
            id: tag,
            label: <T id={`Forms.tags.${tag}`} />,
          }))}
          className="mr-8"
        />
        <Checkbox
          value={hasRules}
          onChange={e => setHasRules(e.target.checked)}
          label="Critères d'octroi"
        />
      </div>

      {Object.keys(organisations).map(type => (
        <div key={type}>
          <div className="lender-picker-dialog-type">
            <h3 className="mt-32 mb-0">
              <T id={`Forms.type.${type}`} />
            </h3>
          </div>
          {organisations[type]
            .map(org => (
              <LenderPickerOrganisation
                key={org._id}
                organisation={org}
                addLender={addLender}
                removeLender={removeLender}
                isActive={isActive({ loan, org })}
                loan={loan}
              />
            ))
            .map((item, i) => [i !== 0 && <hr />, item])}
        </div>
      ))}
    </div>
  </DialogSimple>
);

export default LenderPickerContainer(LenderPicker);
