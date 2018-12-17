// @flow
import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '../../../../List';
import T from '../../../../Translation';
import IconButton from '../../../../IconButton';

type MortgageNotesPickerListProps = {};

const MortgageNotesPickerList = ({
  mortgageNotes,
  removeMortgageNote,
}: MortgageNotesPickerListProps) => (
  <List>
    {mortgageNotes.map(({ _id, value, rank, borrowerName, isBorrower }) => (
      <ListItem key={_id} button>
        <ListItemText
          primary={<span>{`CHF ${toMoney(value)}`}&nbsp;</span>}
          secondary={(
            <span>
              {[
                isBorrower && <span>{borrowerName}</span>,
                rank && (
                  <span>
                    <T id="Forms.rank" />
                    &nbsp;
                    {rank}
                  </span>
                ),
              ]
                .filter(x => x)
                .map((tag, i) => [i !== 0 && ', ', tag])}
            </span>
          )}
        />
        {isBorrower && (
          <ListItemSecondaryAction>
            <IconButton
              tooltip={<T id="general.remove" />}
              type="close"
              onClick={() => removeMortgageNote(_id)}
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    ))}
  </List>
);

export default MortgageNotesPickerList;
