import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Button from '../Button';
import Icon from '../Icon';
import Dialog from '../Material/Dialog';
import T, { Money } from '../Translation';

const PropertyReuser = ({
  setOpenPropertyAdder,
  reusableProperties = [],
  openModal,
  setOpenModal,
  linkProperty,
}) => (
  <Dialog
    title={<T id="PropertyAdder.reuser.dialogTitle" />}
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
        <T id="PropertyAdder.reuser.dialogDescription" />
      </p>
      <Button
        onClick={() => {
          setOpenModal(false);
          setOpenPropertyAdder(true);
        }}
        label={<T id="PropertyAdder.reuser.newProperty" />}
        secondary
        raised
        icon={<Icon type="add" />}
        className="mb-32"
        style={{ maxWidth: '250px' }}
      />
      <h4>
        <T id="PropertyAdder.reuser.reusePropertyTitle" />
      </h4>
      <List className="flex-col" style={{ width: '100%' }}>
        {reusableProperties.map(({ _id, address, totalValue }) => (
          <ListItem key={_id} button onClick={() => linkProperty(_id)}>
            <ListItemText
              primary={address}
              secondary={<Money value={totalValue} />}
            />
          </ListItem>
        ))}
      </List>
    </div>
  </Dialog>
);

export default PropertyReuser;
