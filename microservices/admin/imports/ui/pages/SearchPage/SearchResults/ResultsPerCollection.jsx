import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { T } from 'core/components/Translation';
import { getLoanValue } from 'core/utils/loanFunctions';
import {
  PROPERTY_STATUS,
  PROPERTY_STYLE,
} from 'core/api/properties/propertyConstants';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';
import ResultSecondaryText from './ResultSecondaryText';

const getBorrowerInfo = (result) => {
  const { _id, firstName, lastName, createdAt, updatedAt } = result;
  const primary = getBorrowerFullName({ firstName, lastName }) || (
    <T id="general.borrower" />
  );
  const secondary = (
    <ResultSecondaryText infos={{ _id, createdAt, updatedAt }} />
  );

  return { primary, secondary };
};

const getLoanInfo = (result) => {
  const { _id, name, createdAt, updatedAt, logic, general, property } = result;
  const { step } = logic;
  const value = getLoanValue({
    loan: result,
    property,
  });
  const { fortuneUsed, insuranceFortuneUsed } = general;

  const primary = name || <T id="general.loan" />;
  const secondary = (
    <ResultSecondaryText
      infos={{
        _id,
        createdAt,
        updatedAt,
        step,
        value,
        fortuneUsed,
        insuranceFortuneUsed,
      }}
    />
  );

  return { primary, secondary };
};

const getPropertyInfo = (result) => {
  const {
    _id,
    city,
    zipCode,
    address1,
    address2,
    value,
    status,
    style,
    insideArea,
  } = result;
  const primary = address1 || address2 || <T id="general.property" />;
  const secondary = (
    <ResultSecondaryText
      infos={{
        _id,
        city,
        zipCode,
        value,
        status: PROPERTY_STATUS[status],
        style: PROPERTY_STYLE[style],
        insideArea,
      }}
    />
  );

  return { primary, secondary };
};

const getUserInfo = (result) => {
  const { _id, emails, profile, roles, createdAt, assignedEmployee } = result;
  const organization = profile ? profile.organization : null;
  const assignedEmployeeName = assignedEmployee
    ? assignedEmployee.username || assignedEmployee.emails[0].address
    : 'unassigned';

  const primary = emails[0].address || <T id="general.user" />;
  const secondary = (
    <ResultSecondaryText
      infos={{
        _id,
        organization,
        roles,
        createdAt,
        assignedTo: assignedEmployeeName,
      }}
    />
  );

  return { primary, secondary };
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
