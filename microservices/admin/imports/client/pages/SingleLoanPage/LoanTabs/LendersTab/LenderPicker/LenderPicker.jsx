// @flow
import React from 'react';

import DialogSimple from 'core/components/DialogSimple';
import T from 'core/components/Translation';
import LenderPickerContainer from './LenderPickerContainer';
import LenderPickerOrganisation from './LenderPickerOrganisation';

type LenderPickerProps = {};

const LenderPicker = ({
  organisations,
  count,
  loan,
  addLender,
  removeLender,
}: LenderPickerProps) => (
  <DialogSimple label="Choisir prêteurs" closeOnly primary>
    <div className="lender-picker-dialog">
      <h3>Choisir prêteurs</h3>
      {count === 0 && (
        <h1 className="secondary">
          Pas de prêteurs, ajouter un prêteur en donnant cette fonctionalité à
          une organisation.
        </h1>
      )}
      {Object.keys(organisations).map(type => (
        <div key={type}>
          <h4>
            <T id={`Forms.type.${type}`} />
          </h4>
          {organisations[type].map(org => (
            <LenderPickerOrganisation
              key={org._id}
              organisation={org}
              addLender={addLender}
              removeLender={removeLender}
              isActive={loan.lenders.find(({ organisation }) =>
                organisation && organisation._id === org._id)}
            />
          ))}
        </div>
      ))}
    </div>
  </DialogSimple>
);

export default LenderPickerContainer(LenderPicker);
