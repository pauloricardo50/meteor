// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import DialogSimple from 'core/components/DialogSimple';
import T from 'core/components/Translation';
import IconButton from 'imports/core/components/IconButton/IconButton';
import LenderPickerContainer from './LenderPickerContainer';
import LenderPickerOrganisation from './LenderPickerOrganisation';

type LenderPickerProps = {};

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
}: LenderPickerProps) => (
  <DialogSimple
    label="Choisir prêteurs"
    closeOnly
    primary
    rootStyle={{ marginRight: 8 }}
    // title="Choisir prêteurs"
  >
    <div className="lender-picker-dialog">
      <h2>Choisir prêteurs</h2>
      {count === 0 && (
        <h1 className="secondary">
          Pas de prêteurs, ajouter un prêteur en donnant cette fonctionalité à
          une organisation.
        </h1>
      )}
      {Object.keys(organisations).map(type => (
        <div key={type}>
          <div className="lender-picker-dialog-type">
            <h3>
              <T id={`Forms.type.${type}`} />
            </h3>
            {organisations[type].every(org => !isActive({ loan, org })) && (
              <Tooltip title="Tout choisir">
                <IconButton
                  className="success"
                  type="add"
                  onClick={addAllLendersOfType({
                    organisations,
                    type,
                    addLender,
                  })}
                />
              </Tooltip>
            )}
          </div>
          {organisations[type].map(org => (
            <LenderPickerOrganisation
              key={org._id}
              organisation={org}
              addLender={addLender}
              removeLender={removeLender}
              isActive={isActive({ loan, org })}
            />
          ))}
        </div>
      ))}
    </div>
  </DialogSimple>
);

export default LenderPickerContainer(LenderPicker);
