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
  console.log(result);
  const {
    _id,
    name,
    createdAt,
    updatedAt,
    logic,
    propertyId,
    general,
  } = result;
  const { step } = logic;
  const { value } = propertyId.value || null;
  const { fortuneUsed, insuranceFortuneUsed } = general;

  const primary = name || <T id="general.loan" />;
  const secondary = (
    <ResultSecondaryInfos
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

// const getpropertiesInfo = (result) => {
//   const { _id, firstName, lastName, createdAt, updatedAt } = result;
//   const primary = getBorrowerFullName({ firstName, lastName }) || (
//     <T id="general.borrower" />
//   );
//   const secondary = (
//     <ResultSecondaryInfos infos={{ _id, createdAt, updatedAt }} />
//   );
//   return { primary, secondary };
// };

const getInfoToDisplay = (result, collection) => {
  switch (collection) {
  case 'borrowers':
    return getBorrowerInfo(result);
  case 'loans':
    return getLoanInfo(result);

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
