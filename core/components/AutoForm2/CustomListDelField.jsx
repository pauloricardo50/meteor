// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { ListDelField } from 'uniforms-material';

import { iconMap as IconMap } from '../Icon/Icon';

const CustomListDelField = ({ name }) => (
  <ListDelField
    className="list-del-field"
    name={name}
    // Do this because of a cypress issue and uniforms: https://github.com/vazco/uniforms/issues/652
    icon={!Meteor.isAppTest && <IconMap.remove />}
    size="small"
  />
);

export default React.memo(CustomListDelField);
