import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText } from 'material-ui/List';

import { LoadingComponent } from 'core/components/Loading';
import {
  USERS_COLLECTION,
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
} from 'core/api/constants';

import DetailSideNavListContainer from './DetailSideNavListContainer';

const getListItemDetails = (collectionName, doc) => {
  switch (collectionName) {
  case USERS_COLLECTION:
    return {
      primary: doc.emails[0].address,
      secondary: doc.roles.join(', '),
    };
  case LOANS_COLLECTION:
    return { primary: doc._id, secondary: doc.name };
  case BORROWERS_COLLECTION:
    return { primary: `${doc.firstName} ${doc.lastName}`, secondary: '' };
  default:
    throw new Error('invalid collection name');
  }
};

const DetailSideNavList = ({
  isLoading,
  data,
  error,
  hideDetailNav,
  collectionName,
  history: { push },
}) => {
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <List>
      {data.map(doc => (
        <ListItem
          button
          key={doc._id}
          onClick={() => {
            push(`/${collectionName}/${doc._id}`);
            hideDetailNav();
          }}
        >
          <ListItemText {...getListItemDetails(collectionName, doc)} />
        </ListItem>
      ))}
    </List>
  );
};

DetailSideNavList.propTypes = {
  history: PropTypes.object.isRequired,
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
