import React from 'react';
import cx from 'classnames';
import useWindowScroll from 'react-use/lib/useWindowScroll';

import { ACTIONS } from '../AdminBoardConstants';
import AdminBoardOptionsContent from './AdminBoardOptionsContent';

const makeOnChange = (filterName, dispatch) => (prev, next) => {
  if (!prev.includes(null) && next.includes(null)) {
    // If previously a specific id was checked, and now you check "all" (i.e. null)
    // uncheck all checkboxes
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: undefined },
    });
  } else if (prev.includes(null) && next.length > 1) {
    // If you previously had "all" checked, and check a specific checkbox,
    // uncheck "all" (i.e. null)
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: { $in: next.filter(x => x) } },
    });
  } else {
    // Simple check
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { name: filterName, value: { $in: next } },
    });
  }
};

const AdminBoardOptions = props => {
  const { y } = useWindowScroll();
  return (
    <div className={cx('admin-board-options', { fixed: y > 68 })}>
      <AdminBoardOptionsContent makeOnChange={makeOnChange} {...props} />
    </div>
  );
};

export default AdminBoardOptions;
