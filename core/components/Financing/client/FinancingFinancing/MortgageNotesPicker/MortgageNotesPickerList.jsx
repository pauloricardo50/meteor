//
import React from 'react';

import Icon from 'core/components/Icon/Icon';
import { toMoney } from '../../../../../utils/conversionFunctions';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '../../../../List';
import T from '../../../../Translation';
import IconButton from '../../../../IconButton';

const MortgageNotesPickerList = ({
  mortgageNotes,
  removeMortgageNote,
  canton,
}) => (
  <List>
    {mortgageNotes.map(
      ({
        _id,
        value,
        rank,
        canton: noteCanton,
        borrowerName,
        isBorrower,
        selected,
        available,
        onClick = () => null,
      }) => (
        <ListItem
          key={_id}
          button
          selected={selected}
          disabled={isBorrower && !available}
          onClick={onClick}
          className="mortgage-note-list-item"
        >
          <ListItemText
            primary={
              <span>
                {`CHF ${toMoney(value)}`}
                &nbsp;
              </span>
            }
            secondary={
              <div className="mortgage-note-list-item-description">
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
                {isBorrower && (
                  <span className="mortgage-note-list-item-description-canton">
                    <T id={`Forms.canton.${noteCanton}`} />
                  </span>
                )}
              </div>
            }
          >
            Hello
          </ListItemText>
          {isBorrower && selected && (
            <ListItemSecondaryAction>
              <IconButton
                tooltip={<T id="general.remove" />}
                type="close"
                onClick={() => removeMortgageNote(_id)}
              />
            </ListItemSecondaryAction>
          )}
          {isBorrower && !available && (
            <ListItemSecondaryAction>
              <Icon
                style={{ marginRight: 12, width: 24, height: 24 }}
                type="info"
                tooltip={
                  <span>
                    Non applicable pour le canton de{' '}
                    <T id={`Forms.canton.${canton}`} />
                  </span>
                }
              />
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ),
    )}
  </List>
);

export default MortgageNotesPickerList;
