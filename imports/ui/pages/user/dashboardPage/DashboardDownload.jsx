import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation.jsx';

import DashboardItem from './DashboardItem.jsx';

const DashboardDownload = props => {
  return (
    <DashboardItem title={<T id="DashboardDownload.title" />}>
      MyComponent
    </DashboardItem>
  );
};

DashboardDownload.propTypes = {};

export default DashboardDownload;
