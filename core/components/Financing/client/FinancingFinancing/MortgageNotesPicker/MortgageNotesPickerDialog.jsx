// @flow
import React from 'react';

import T from '../../../../Translation';
import List, { ListItem, ListItemText } from '../../../../List';
import UpdateField from '../../../../UpdateField';
import { PROPERTIES_COLLECTION } from '../../../../../api/constants';
import { getProperty } from '../../FinancingCalculator';

type MortgageNotesPickerDialogProps = {};

const MortgageNotesPickerDialog = (props: MortgageNotesPickerDialogProps) => {
  const property = getProperty(props);
  if (!property) {
    return (
      <p className="description">
        <T id="FinancingMortgageNotesPicker.noProperty" />
      </p>
    );
  }

  if (!property.canton) {
    return (
      <div className="flex-col">
        <p className="description">
          <T id="FinancingMortgageNotesPicker.noCanton" />
        </p>
        <UpdateField
          doc={property}
          fields={['zipCode']}
          collection={PROPERTIES_COLLECTION}
        />
      </div>
    );
  }

  return (
    <div>
      <List>
        <ListItem>
          <ListItemText />
        </ListItem>
      </List>
    </div>
  );
};

export default MortgageNotesPickerDialog;
