import ListItemMaterial from '@material-ui/core/ListItem';
import React, { Children } from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';

import { CustomAutoField } from './AutoFormComponents';
import CustomListDelField from './CustomListDelField';

const ListItem = ({ dense, divider, disableGutters, removeIcon, ...props }) => (
  <ListItemMaterial
    dense={dense}
    divider={divider}
    disableGutters={disableGutters}
  >
    {props.children ? (
      Children.map(props.children, child =>
        React.cloneElement(child, {
          name: joinName(props.name, child.props.name),
          label: null,
        }),
      )
    ) : (
      <CustomAutoField isListField {...props} />
    )}
    <CustomListDelField name={props.name} />
  </ListItemMaterial>
);

ListItem.defaultProps = {
  dense: true,
};

export default connectField(ListItem, {
  includeInChain: false,
  includeParent: true,
});
