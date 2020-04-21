import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import Loading from 'core/components/Loading';
import Roles from 'core/components/Roles';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import TestBadge from 'core/components/TestBadge';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';

import DetailSideNavListContainer from './DetailSideNavListContainer';
import DetailSideNavPagination from './DetailSideNavPagination';

const getListItemDetails = (
  collectionName,
  { anonymous, canton, city, name, roles, status, structure, user, isTest },
) => {
  switch (collectionName) {
    case USERS_COLLECTION:
      return {
        primary: name,
        secondary: <Roles roles={roles} />,
      };
    case LOANS_COLLECTION: {
      const loanValue =
        structure && Calculator.selectLoanValue({ loan: { structure } });
      const loanValueText =
        loanValue > 0 ? `CHF ${toMoney(loanValue)}` : 'Pas encore structuré';

      return {
        primary: `${name} - ${
          anonymous ? 'Anonyme' : user ? user.name : 'Pas de compte'
        }`,
        secondary: (
          <span>
            <StatusLabel status={status} collection={LOANS_COLLECTION} /> -{' '}
            {loanValueText}
          </span>
        ),
      };
    }
    case PROMOTIONS_COLLECTION:
      return {
        primary: (
          <span>
            {name || 'Promotion sans nom'}
            {isTest && <TestBadge />}
          </span>
        ),
        secondary: (
          <div>
            <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />
            &nbsp;
            <span>
              {city}
              &nbsp;
              {canton}
            </span>
          </div>
        ),
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
  toggleDrawer,
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
            hideDetailNav();
            push(`/${collectionName}/${doc._id}`);
            toggleDrawer();
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
  collectionName: PropTypes.string.isRequired,
  data: PropTypes.array,
  hideDetailNav: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isEnd: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  showMore: PropTypes.func.isRequired,
};

DetailSideNavList.defaultProps = {
  data: [],
  isLoading: false,
};

export default DetailSideNavListContainer(DetailSideNavList);
