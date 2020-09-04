import React from 'react';
import Dialog from '@material-ui/core/Dialog';

const AdminBoardModal = ({
  docId,
  closeModal,
  currentUser,
  modalContent: ModalContent,
  getModalContentProps = () => {},
}) => (
  <Dialog
    open={!!docId}
    onEscapeKeyDown={closeModal}
    onBackdropClick={closeModal}
    fullWidth
    maxWidth="xl"
  >
    <div className="admin-board-modal">
      <ModalContent {...getModalContentProps({ docId, currentUser })} />
    </div>
  </Dialog>
);

export default AdminBoardModal;
