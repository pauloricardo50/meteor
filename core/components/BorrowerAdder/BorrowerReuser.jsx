import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Button from '../Button';
import Icon from '../Icon';
import Dialog from '../Material/Dialog';

const BorrowerReuser = ({
  insertBorrower,
  reusableBorrowers = [],
  openModal,
  setOpenModal,
  borrowerLabel,
  linkBorrower,
}) => (
  <Dialog
    title={`Ajouter un ${borrowerLabel}`}
    open={openModal}
    actions={[
      <Button
        key="cancel"
        onClick={() => setOpenModal(false)}
        label="Annuler"
        raised
        primary
      />,
    ]}
  >
    <div className="flex-col center">
      <p className="description">
        Vous pouvez ajouter un nouvel {borrowerLabel} ou en réutiliser un déjà
        existant
      </p>
      <Button
        onClick={() => insertBorrower}
        label={`Nouvel ${borrowerLabel}`}
        secondary
        raised
        icon={<Icon type="add" />}
        className="mb-32"
        style={{ maxWidth: '200px' }}
      />
      <h4>Réutiliser un {borrowerLabel} existant</h4>
      <List className="flex-col" style={{ width: '100%' }}>
        {reusableBorrowers.map(
          ({ name, _id, loans = [], insuranceRequests = [] }) => (
            <ListItem key={_id} button onClick={() => linkBorrower(_id)}>
              <ListItemText
                primary={
                  name ||
                  `${borrowerLabel.charAt(0).toUpperCase() +
                    borrowerLabel.substring(1)} sans nom`
                }
                secondary={[...loans, ...insuranceRequests]
                  .map(({ name: linkName }) => linkName)
                  .join(', ')}
              />
            </ListItem>
          ),
        )}
      </List>
    </div>
  </Dialog>
);

export default BorrowerReuser;
