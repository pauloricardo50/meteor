import React from 'react';
import PropTypes from 'prop-types';
import List, { ListItem, ListItemText } from 'material-ui/List';

import Loading from 'core/components/Loading';
import {
  USERS_COLLECTION,
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
} from 'core/api/constants';

import DetailSideNavListContainer from './DetailSideNavListContainer';
import DetailSideNavPagination from './DetailSideNavPagination';

const getListItemDetails = (
  collectionName,
  { emails, roles, _id, name, firstName, lastName },
) => {
  switch (collectionName) {
  case USERS_COLLECTION:
    return {
      primary: emails[0].address,
      secondary: roles && roles.join(', '),
    };
  case LOANS_COLLECTION:
    return { primary: _id, secondary: name };
  case BORROWERS_COLLECTION:
    return { primary: `${firstName} ${lastName}`, secondary: '' };
  default:
    throw new Error('invalid collection name');
  }
};

const DetailSideNavList = ({
  isLoading,
  data,
  hideDetailNav,
  showMore,
  collectionName,
  totalCount,
  history: { push },
}) => {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <List className="detail-side-nav-list">
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
      <DetailSideNavPagination
        showMore={showMore}
        isEnd={data.length >= totalCount}
      />
    </List>
  );
};

DetailSideNavList.propTypes = {
  history: PropTypes.object.isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  collectionName: PropTypes.string.isRequired,
  hideDetailNav: PropTypes.func.isRequired,
  showMore: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
};

DetailSideNavList.defaultProps = {
  data: [],
  isLoading: false,
};

export default DetailSideNavListContainer(DetailSideNavList);
