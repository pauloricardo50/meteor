import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemText } from 'material-ui/List';
import { T, IntlDate } from 'core/components/Translation';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';
import ResultSecondaryInfos from './ResultSecondaryInfo';

const getBorrowerInfo = (result) => {
  const { _id, firstName, lastName, createdAt, updatedAt } = result;
  const primary = getBorrowerFullName({ firstName, lastName }) || (
    <T id="general.borrower" />
  );
  const secondary = (
    <ResultSecondaryInfos infos={{ _id, createdAt, updatedAt }} />
  );
  return { primary, secondary };
};

const getLoanInfo = (result) => {
  const {
    _id,
    name,
    createdAt,
    updatedAt,
    logic,
    general,
  } = result;
  const { step } = logic;
  const { fortuneUsed, insuranceFortuneUsed } = general;

  const primary = name || <T id="general.loan" />;
  const secondary = (
    <ResultSecondaryInfos
      infos={{
        _id,
        createdAt,
        updatedAt,
        step,
        fortuneUsed,
        insuranceFortuneUsed,
      }}
    />
  );
  return { primary, secondary };
};

const getPropertyInfo = (result) => {
  const { _id, city, zipCode, address1, address2, value, status, style, insideArea } = result;
  const primary = address1 || address2 || (
    <T id="general.property" />
  );
  const secondary = (
    <ResultSecondaryInfos infos={{ _id,
      city,
      zipCode,
      value,
      status,
      style,
      insideArea }}
    />
  );
  return { primary, secondary };
};

const getUserInfo = (result) => {
  const { _id,
    emails,
    profile,
    roles,
    createdAt } = result;
  const organization = profile ? profile.organization : null;
  const primary = emails[0].address || (
    <T id="general.user" />
  );
  const secondary = (
    <ResultSecondaryInfos infos={{ _id,
      organization,
      roles,
      createdAt }}
    />
  );
  return { primary, secondary };
};

const getInfoToDisplay = (result, collection) => {
  switch (collection) {
  case 'borrowers':
    return getBorrowerInfo(result);
  case 'loans':
    return getLoanInfo(result);
  case 'properties':
    return getPropertyInfo(result);
  case 'users':
    return getUserInfo(result);

  default:
    return null;
  }
};

export default ({ results, collection }) =>
  results.map((result) => {
    const { _id } = result;
    const { primary, secondary } = getInfoToDisplay(result, collection) || {
      primary: null,
      secondary: null,
    };
    return (
      <Link to={`/${collection}/${_id}`} key={_id}>
        <ListItem button divider>
          <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
      </Link>
    );
  });
