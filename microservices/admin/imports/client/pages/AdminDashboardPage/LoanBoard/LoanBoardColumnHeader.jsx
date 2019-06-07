// @flow
import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import DropdownMenu from 'core/components/DropdownMenu';
import Icon from 'core/components/Icon';
import { ACTIONS, SORT_ORDER, GROUP_BY, SORT_BY } from './loanBoardConstants';

type LoanBoardColumnHeaderProps = {};

const getTitle = ({ id, groupBy, admins, promotions }) => {
  switch (groupBy) {
  case GROUP_BY.STATUS:
    return <T id={`Forms.status.${id}`} />;
  case GROUP_BY.PROMOTION: {
    const promotion = promotions.find(({ _id }) => id === _id);
    return promotion ? promotion.name : 'Sans promo';
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
    { id: SORT_BY.CREATED_AT, label: "Date d'ajout" },
    { id: SORT_BY.ASSIGNED_EMPLOYEE, label: 'Conseiller' },
    { id: SORT_BY.STATUS, label: 'Statut' },
  ].map((item) => {
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
}: LoanBoardColumnHeaderProps) => {
  const { groupBy } = options;

  return (
    <div className="loan-board-column-header">
      <h4 className="title">
        <span>{getTitle({ id, groupBy, admins, promotions })}</span>
        &nbsp;
        <span className="secondary">
(
          {count}
)
        </span>
      </h4>
      <DropdownMenu
        iconType="sort"
        buttonProps={{ className: 'sort' }}
        options={getOptions(options, dispatch)}
      />
    </div>
  );
};

export default LoanBoardColumnHeader;
