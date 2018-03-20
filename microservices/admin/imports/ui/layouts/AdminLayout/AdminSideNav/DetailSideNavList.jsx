import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { LoadingComponent } from 'core/components/Loading';
import DetailSideNavListContainer from './DetailSideNavListContainer';

const DetailSideNavList = ({
  isLoading,
  data,
  error,
  hideDetailNav,
  collectionName,
}) => {
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <List>
      {data.map(doc => (
        <ListItem key={doc._id} onClick={hideDetailNav}>
          <Link to={`/${collectionName}/${doc._id}`}>
            <ListItemText primary={doc._id} secondary="Hello World" />
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

DetailSideNavList.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  collectionName: PropTypes.string.isRequired,
  hideDetailNav: PropTypes.func.isRequired,
};

DetailSideNavList.defaultProps = {
  data: [],
  isLoading: false,
};

export default DetailSideNavListContainer(DetailSideNavList);
