import React from 'react';
import cx from 'classnames';

import DropdownMenu from 'core/components/DropdownMenu';
import Icon from 'core/components/Icon';
import StatusLabel from 'core/components/StatusLabel';

import { ACTIONS, GROUP_BY, SORT_ORDER } from './AdminBoardConstants';

const getTitle = ({ id, groupBy, admins, collection }) => {
  switch (groupBy) {
    case GROUP_BY.STATUS:
      return <StatusLabel status={id} collection={collection} />;
    case GROUP_BY.ADMIN: {
      const admin = admins.find(({ _id }) => id === _id);
      return admin ? admin.firstName : 'Personne';
    }

    default:
      break;
  }
};

const getOptions = (columnHeaderOptions, { sortBy, sortOrder }, dispatch) =>
  columnHeaderOptions.map(item => {
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

const AdminBoardColumnHeader = ({
  id,
  options,
  dispatch,
  count,
  admins,
  collection,
  columnHeaderOptions,
  getAdditionalTitle,
  ...props
}) => {
  const { groupBy } = options;

  return (
    <div className="admin-board-column-header">
      <div className="flex align-center sb">
        <div className="title">
          <span className="mr-4">
            {getTitle({ id, groupBy, admins, collection, ...props }) ||
              getAdditionalTitle({ id, groupBy, admins, collection, ...props })}
          </span>
          <span className="secondary">({count})</span>
        </div>
        <DropdownMenu
          iconType="sort"
          buttonProps={{ size: 'small' }}
          options={getOptions(columnHeaderOptions, options, dispatch)}
          noWrapper
        />
      </div>
    </div>
  );
};

export default AdminBoardColumnHeader;
