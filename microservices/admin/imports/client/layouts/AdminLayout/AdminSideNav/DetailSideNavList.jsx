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
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';
import Calculator from 'core/utils/Calculator';
import StatusLabel from 'imports/core/components/StatusLabel/StatusLabel';
import DetailSideNavListContainer from './DetailSideNavListContainer';
import DetailSideNavPagination from './DetailSideNavPagination';

const getListItemDetails = (
  collectionName,
  {
    address1,
    anonymous,
    canton,
    city,
    loans,
    name,
    organisations = [],
    promotion,
    roles,
    status,
    structure,
    user,
    value,
  },
) => {
  switch (collectionName) {
  case USERS_COLLECTION:
    return {
      primary: name,
      secondary: <Roles roles={roles} />,
    };
  case LOANS_COLLECTION: {
    const loanValue = structure && Calculator.selectLoanValue({ loan: { structure } });
    const loanValueText = loanValue > 0 ? `CHF ${toMoney(loanValue)}` : 'Pas encore structuré';

    return {
      primary: `${name} - ${
        anonymous ? 'Anonyme' : user ? user.name : "Pas d'utilisateur"
      }`,
      secondary: (
        <span>
          <StatusLabel status={status} collection={LOANS_COLLECTION} />
          {' '}
-
          {' '}
          {loanValueText}
        </span>
      ),
    };
  }
  case BORROWERS_COLLECTION:
    return {
      primary: name || 'Emprunteur sans nom',
      secondary:
          loans && loans.map(({ name: loanName }) => loanName).join(', '),
    };

  case PROMOTIONS_COLLECTION:
    return {
      primary: name || 'Promotion sans nom',
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

  case PROPERTIES_COLLECTION:
    return {
      primary: name || address1 || 'Bien sans adresse',
      secondary: (
        <span className="flex-col">
          <span>{value && `CHF ${toMoney(value)}`}</span>
          <span>
            {loans && loans.map(({ name: loanName }) => loanName).join(', ')}
            {promotion && promotion.name}
          </span>
        </span>
      ),
    };

  case CONTACTS_COLLECTION:
    return {
      primary: name || 'Contact sans nom',
      secondary: organisations.map(({ name: orgName }) => orgName).join(', '),
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
            hideDetailNav();
            push(`/${collectionName}/${doc._id}`);
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
