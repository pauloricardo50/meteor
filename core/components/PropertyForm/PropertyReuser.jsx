import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import DialogSimple from '../DialogSimple';
import T, { Money } from '../Translation';
import Icon from '../Icon';
import PropertyReuserContainer from './PropertyReuserContainer';

const PropertyReuser = ({ properties, handleSelectProperty, disabled }) => (
  <DialogSimple
    buttonProps={{
      raised: true,
      primary: true,
      label: <T id="PropertiesPageAdder.reuseProperty" />,
      icon: <Icon type="loop" />,
      disabled,
    }}
    title={<T id="PropertiesPageAdder.reuseProperty" />}
  >
    {!properties ||
      (properties.length === 0 && (
        <p>
          Vous n'avez pas de bien immobiliers à réutiliser dans d'autres
          dossiers
        </p>
      ))}
    <List className="flex-col">
      {properties.map(({ totalValue, address, _id }) => (
        <ListItem button key={_id} onClick={() => handleSelectProperty(_id)}>
          <ListItemText
            primary={address}
            secondary={<Money value={totalValue} />}
          />
        </ListItem>
      ))}
    </List>
  </DialogSimple>
);

export default PropertyReuserContainer(PropertyReuser);
