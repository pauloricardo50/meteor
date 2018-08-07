import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Loading from 'core/components/Loading';
import Roles from 'core/components/Roles';
import { toMoney } from 'core/utils/conversionFunctions';
import {
  USERS_COLLECTION,
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
} from 'core/api/constants';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';
import { getUserDisplayName } from 'core/utils/userFunctions';

import DetailSideNavListContainer from './DetailSideNavListContainer';
import DetailSideNavPagination from './DetailSideNavPagination';

const getListItemDetails = (
  collectionName,
  { emails, roles, _id, name, firstName, lastName, username, structure },
) => {
  switch (collectionName) {
  case USERS_COLLECTION:
    return {
      primary: getUserDisplayName({ firstName, lastName, username, emails }),
      secondary: <Roles roles={roles} />,
    };
  case LOANS_COLLECTION: {
    const { wantedLoan } = structure;
    return {
      primary: name,
      secondary:
          wantedLoan > 0
            ? `CHF ${toMoney(wantedLoan)}`
            : 'Pas encore structuré',
    };
  }
  case BORROWERS_COLLECTION:
    return {
      primary: getBorrowerFullName({ firstName, lastName }),
      secondary: '',
    };
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
  isEnd,
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
      <DetailSideNavPagination showMore={showMore} isEnd={isEnd} />
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
  isEnd: PropTypes.bool.isRequired,
};

DetailSideNavList.defaultProps = {
  data: [],
  isLoading: false,
};

export default DetailSideNavListContainer(DetailSideNavList);
