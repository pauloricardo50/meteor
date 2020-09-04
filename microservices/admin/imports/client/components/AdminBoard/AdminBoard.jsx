import React from 'react';

import AdminBoardCard from './AdminBoardCard/AdminBoardCard';
import AdminBoardColumnHeader from './AdminBoardColumnHeader';
import { ACTIONS } from './AdminBoardConstants';
import AdminBoardContainer from './AdminBoardContainer';
import AdminBoardModal from './AdminBoardModal';
import AdminBoardOptions from './AdminBoardOptions/AdminBoardOptions';
import Board from './Board';

const AdminBoard = ({
  data,
  options,
  dispatch,
  admins,
  devAndAdmins,
  currentUser,
  columnHeaderProps = {},
  columnItemProps = {},
  makeOptionsSelect,
  optionsSelectProps = {},
  getModalContentProps,
  modalContent,
}) => (
  <div className="admin-board">
    <AdminBoardOptions
      options={options}
      dispatch={dispatch}
      admins={admins}
      devAndAdmins={devAndAdmins}
      makeOptionsSelect={makeOptionsSelect}
      {...optionsSelectProps}
    />
    <Board
      data={data}
      columnHeader={AdminBoardColumnHeader}
      columnHeaderProps={{ options, dispatch, admins, ...columnHeaderProps }}
      columnItem={AdminBoardCard}
      columnItemProps={{
        setDocId: docId =>
          dispatch({ type: ACTIONS.SET_DOC_ID, payload: docId }),
        ...columnItemProps,
      }}
    />
    <AdminBoardModal
      docId={options.docId}
      closeModal={() => dispatch({ type: ACTIONS.SET_DOC_ID, payload: '' })}
      currentUser={currentUser}
      getModalContentProps={getModalContentProps}
      modalContent={modalContent}
    />
  </div>
);

export default AdminBoardContainer(AdminBoard);
