import ListItemMaterial from '@material-ui/core/ListItem';
import React, { Children } from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';

import ListDelField from 'uniforms-material/ListDelField';
import { CustomAutoField } from './AutoFormComponents';
import { iconMap as IconMap } from '../Icon/Icon';

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
    <ListDelField
      className="list-del-field"
      name={props.name}
      icon={<IconMap.remove />}
      size="small"
    />
  </ListItemMaterial>
);

ListItem.defaultProps = {
  dense: true,
};

export default connectField(ListItem, {
  includeInChain: false,
  includeParent: true,
});
