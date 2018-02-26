import React from 'react';
import PropTypes from 'prop-types';

import List, { ListItem, ListItemText } from 'material-ui/List';

import DetailSideNavListContainer from './DetailSideNavListContainer';

const DetailSideNavList = ({ isLoading, data, error }) => {
  // if (isLoading) {
  if (true) {
    return 'Is loading..';
  }

  return (
    <List>
      {data.map(doc => (
        <ListItem key={doc._id}>
          <ListItemText primary={doc._id} secondary="Hello World" />
        </ListItem>
      ))}
    </List>
  );
};

DetailSideNavList.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
};

DetailSideNavList.defaultProps = {
  data: [],
  isLoading: false,
};

export default DetailSideNavListContainer(DetailSideNavList);
