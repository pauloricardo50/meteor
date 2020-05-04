import React from 'react';
import cx from 'classnames';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import DropdownMenu from 'core/components/DropdownMenu';
import Icon from 'core/components/Icon';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel';

import { ACTIONS, GROUP_BY, SORT_BY, SORT_ORDER } from './loanBoardConstants';

const getTitle = ({ id, groupBy, admins, promotions }) => {
  switch (groupBy) {
    case GROUP_BY.STATUS:
      return <StatusLabel status={id} collection={LOANS_COLLECTION} />;
    case GROUP_BY.PROMOTION: {
      const promotion = promotions.find(({ _id }) => id === _id);
      return promotion ? (
        <CollectionIconLink relatedDoc={promotion} />
      ) : (
        'Sans promo'
      );
    }
    case GROUP_BY.ADMIN: {
      const admin = admins.find(({ _id }) => id === _id);
      return admin ? admin.firstName : 'Personne';
    }

    default:
      break;
  }
};

const getOptions = ({ sortBy, sortOrder }, dispatch) =>
  [
    { id: SORT_BY.DUE_AT, label: 'Prochain événement' },
    { id: SORT_BY.CREATED_AT, label: "Date d'ajout" },
    { id: SORT_BY.ASSIGNED_EMPLOYEE, label: 'Conseiller' },
    { id: SORT_BY.STATUS, label: 'Statut' },
  ].map(item => {
    let { label } = item;
    if (item.id === sortBy) {
      label = (
        <b className="sort-label">
          <span>{label}</span>
          <Icon
            type="arrowDown"
            className={cx('icon', { rotate: sortOrder === SORT_ORDER.DESC })}
          />
        </b>
      );
    }

    return {
      ...item,
      label,
      onClick: () =>
        dispatch({ type: ACTIONS.SET_COLUMN_SORT, payload: item.id }),
    };
  });

const LoanBoardColumnHeader = ({
  id,
  options,
  dispatch,
  count,
  admins,
  promotions,
}) => {
  const { groupBy } = options;

  return (
    <div className="loan-board-column-header">
      <div className="flex align-center sb">
        <div className="title">
          <span className="mr-4">
            {getTitle({ id, groupBy, admins, promotions })}
          </span>
          <span className="secondary">({count})</span>
        </div>
        <DropdownMenu
          iconType="sort"
          buttonProps={{ size: 'small' }}
          options={getOptions(options, dispatch)}
          noWrapper
        />
      </div>
    </div>
  );
};

export default LoanBoardColumnHeader;
