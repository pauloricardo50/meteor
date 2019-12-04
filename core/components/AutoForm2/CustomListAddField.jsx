// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { ListAddField } from 'uniforms-material';

import { iconMap as IconMap } from '../Icon/Icon';

type CustomListAddFieldProps = {};

const CustomListAddField = (props: CustomListAddFieldProps) => (
  <ListAddField
    color="primary"
    className="list-add-field"
    size="small"
    {...props}
    // Do this because of a cypress issue and uniforms: https://github.com/vazco/uniforms/issues/652
    icon={!Meteor.isAppTest && <IconMap.add />}
  />
);

export default CustomListAddField;
