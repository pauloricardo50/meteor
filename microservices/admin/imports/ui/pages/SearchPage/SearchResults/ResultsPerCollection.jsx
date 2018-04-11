import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText } from 'material-ui/List';

import { T } from 'core/components/Translation';
import { getLoanValue } from 'core/utils/loanFunctions';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';
import ResultSecondaryText from './ResultSecondaryText';

const getBorrowerInfo = ({ firstName, lastName, createdAt, updatedAt }) => ({
  primary: getBorrowerFullName({ firstName, lastName }) || (
    <T id="general.borrower" />
  ),
  secondary: <ResultSecondaryText infos={{ createdAt, updatedAt }} />,
});

const getLoanInfo = (result) => {
  const {
    name,
    createdAt,
    updatedAt,
    logic: { step },
    general: { fortuneUsed, insuranceFortuneUsed },
    property,
  } = result;
  const value = getLoanValue({ loan: result, property });

  return {
    primary: name || <T id="general.loan" />,
    secondary: (
      <ResultSecondaryText
        infos={{
          createdAt,
          updatedAt,
          step,
          value,
          fortuneUsed,
          insuranceFortuneUsed,
        }}
      />
    ),
  };
};

const getPropertyInfo = ({
  city,
  zipCode,
  address1,
  address2,
  value,
  status,
  style,
  insideArea,
}) => ({
  primary: address1 || address2 || <T id="general.property" />,
  secondary: (
    <ResultSecondaryText
      infos={{
        city,
        zipCode,
        value,
        status,
        style,
        insideArea,
      }}
    />
  ),
});

const getUserInfo = ({
  emails,
  profile,
  roles,
  createdAt,
  assignedEmployee,
}) => {
  const organization = profile && profile.organization;
  const assignedEmployeeName = assignedEmployee
    ? assignedEmployee.username || assignedEmployee.emails[0].address
    : 'unassigned';

  return {
    primary: emails[0].address || <T id="general.user" />,
    secondary: (
      <ResultSecondaryText
        infos={{
          organization,
          roles,
          createdAt,
          assignedTo: assignedEmployeeName,
        }}
      />
    ),
  };
};

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
  results: PropTypes.array.isRequired,
  collection: PropTypes.string.isRequired,
};

export default ResultsPerCollection;
