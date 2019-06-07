// @flow
import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import DropdownMenu from 'core/components/DropdownMenu';
import Icon from 'core/components/Icon';
import { ACTIONS, SORT_ORDER } from './loanBoardHelpers';

type LoanBoardColumnHeaderProps = {};

const getTitle = (id, groupBy) => {
  switch (groupBy) {
  case 'status':
    return <T id={`Forms.status.${id}`} />;

  default:
    break;
  }
};

const getOptions = ({ sortBy, sortOrder }, dispatch) =>
  [
    { id: 'createdAt', label: "Date d'ajout" },
    { id: 'assignedEmployee.name', label: 'Conseiller' },
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
      onClick: () => {
        dispatch({ type: ACTIONS.SET_COLUMN_SORT, payload: item.id });
      },
    };
  });

const LoanBoardColumnHeader = ({
  id,
  options,
  dispatch,
}: LoanBoardColumnHeaderProps) => {
  const { groupBy } = options;

  return (
    <div className="loan-board-column-header">
      <h4 className="title">{getTitle(id, groupBy)}</h4>
      <DropdownMenu
        iconType="sort"
        buttonProps={{ className: 'sort' }}
        options={getOptions(options, dispatch)}
      />
    </div>
  );
};

export default LoanBoardColumnHeader;
