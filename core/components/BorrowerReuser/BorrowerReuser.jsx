import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import T from '../Translation';
import BorrowerReuserContainer from './BorrowerReuserContainer';
import DialogSimple from '../DialogSimple';

const BorrowerReuser = ({
  borrowers,
  switchBorrower,
  isLastLoan,
  buttonProps,
}) => {
  if (!borrowers || borrowers.length === 0) {
    return null;
  }

  return (
    <DialogSimple
      label={<T id="BorrowerReuser.buttonLabel" />}
      title={<T id="BorrowerReuser.dialogTitle" />}
      text={
        isLastLoan ? (
          <T id="BorrowerReuser.dialogDescriptionLastLoan" />
        ) : (
          <T id="BorrowerReuser.dialogDescription" />
        )
      }
      renderProps
      buttonProps={buttonProps}
    >
      {({ handleClose }) => (
        <div>
          <List className="flex-col">
            {borrowers.map(({ name, _id, loans = [] }) => (
              <ListItem
                key={_id}
                button
                onClick={() => switchBorrower(_id, handleClose)}
              >
                <ListItemText
                  primary={name || 'Emprunteur sans nom'}
                  secondary={loans
                    .map(({ name: loanName }) => loanName)
                    .join(', ')}
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </DialogSimple>
  );
};

export default BorrowerReuserContainer(BorrowerReuser);
