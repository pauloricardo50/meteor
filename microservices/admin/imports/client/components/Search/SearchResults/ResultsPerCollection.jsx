import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Link from 'core/components/Link';
import T from 'core/components/Translation';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  USERS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';

import ResultSecondaryText from './ResultSecondaryText';

const getBorrowerInfo = ({ name, createdAt, updatedAt }) => ({
  primary: name || <T id="general.borrower" />,
  secondary: <ResultSecondaryText infos={{ createdAt, updatedAt }} />,
});

const getLoanInfo = (loan) => {
  const { name, createdAt, updatedAt, step } = loan;

  return {
    primary: name || <T id="general.loan" />,
    secondary: <ResultSecondaryText infos={{ createdAt, updatedAt, step }} />,
  };
};

const getPropertyInfo = ({
  city,
  zipCode,
  address1,
  address2,
  totalValue,
  status,
  style,
  insideArea,
}) => ({
  primary: address1 || address2 || <T id="general.property" />,
  secondary: (
    <ResultSecondaryText
      infos={{ city, zipCode, totalValue, status, style, insideArea }}
    />
  ),
});

const getUserInfo = ({ roles, createdAt, assignedEmployee, name }) => {
  const assignedEmployeeName = assignedEmployee
    ? assignedEmployee.name
    : 'unassigned';

  return {
    primary: name,
    secondary: (
      <ResultSecondaryText
        infos={{
          roles,
          createdAt,
          assignedTo: assignedEmployeeName,
        }}
      />
    ),
  };
};

const getPromotionInfo = ({ name, promotionLotLinks }) => ({
  primary: name,
  secondary: `${promotionLotLinks.length} lots`,
});

const getContactInfo = ({ name, organisations = [] }) => ({
  primary: name,
  secondary: organisations.map(({ name: orgName }) => orgName).join(', '),
});

const getOrganisationInfo = ({ name }) => ({
  primary: name,
  secondary: null,
});

const getInfoToDisplay = (result, collection) => {
  switch (collection) {
  case BORROWERS_COLLECTION:
    return getBorrowerInfo(result);
  case LOANS_COLLECTION:
    return getLoanInfo(result);
  case PROPERTIES_COLLECTION:
    return getPropertyInfo(result);
  case USERS_COLLECTION:
    return getUserInfo(result);
  case PROMOTIONS_COLLECTION:
    return getPromotionInfo(result);
  case CONTACTS_COLLECTION:
    return getContactInfo(result);
  case ORGANISATIONS_COLLECTION:
    return getOrganisationInfo(result);
  default:
    return null;
  }
};

const ResultsPerCollection = ({ results, collection }) => (
  <List>
    {results.map((result) => {
      const { _id } = result;
      const { primary, secondary } = getInfoToDisplay(result, collection);

      return (
        <ListItem button divider key={_id}>
          <Link to={`/${collection}/${_id}`} className="link">
            <ListItemText primary={primary} secondary={secondary} />
          </Link>
        </ListItem>
      );
    })}
  </List>
);

ResultsPerCollection.propTypes = {
  collection: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
};

export default ResultsPerCollection;
