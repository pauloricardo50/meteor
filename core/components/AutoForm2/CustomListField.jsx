import ListMaterial from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import React, { Children } from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import joinName from 'uniforms/joinName';

import { shouldUpdate } from 'recompose';
import CustomListAddField from './CustomListAddField';
import ListItemField from './CustomListItemField';
import { FIELDS_TO_IGNORE } from './constants';

const List = ({
  addIcon,
  children,
  dense,
  initialCount,
  itemProps,
  label,
  name,
  value,
  ...props
}) => (
  <div>
    <ListMaterial
      key="list"
      dense={dense}
      subheader={
        label ? <ListSubheader disableSticky>{label}</ListSubheader> : undefined
      }
      {...filterDOMProps(props)}
    >
      {children
        ? value.map((item, index) =>
            Children.map(children, child =>
              React.cloneElement(child, {
                key: index,
                label: null,
                name: joinName(
                  name,
                  child.props.name && child.props.name.replace('$', index),
                ),
              }),
            ),
          )
        : value.map((item, index) => (
            <ListItemField
              key={index}
              label={null}
              name={joinName(name, index)}
              {...itemProps}
            />
          ))}
    </ListMaterial>
    <CustomListAddField
      key="listAddField"
      name={`${name}.$`}
      initialCount={initialCount}
    />
  </div>
);

List.defaultProps = {
  dense: true,
};

const CustomListField = connectField(List, {
  ensureValue: false,
  includeInChain: false,
});

export const OptimizedListField = shouldUpdate((props, nextProps) => {
  let update = false;

  Object.keys(nextProps)
    .filter(propName => ![...FIELDS_TO_IGNORE, 'value'].includes(propName))
    .some(propName => {
      const prop = nextProps[propName];

      if (prop !== props[propName]) {
        update = true;
        return true;
      }

      return false;
    });

  if (JSON.stringify(props.value) !== JSON.stringify(nextProps.value)) {
    // Add an exception for list value, as it is an array,
    // it always updates because [] !== []
    update = true;
  }

  return update;
})(CustomListField);

export default CustomListField;
