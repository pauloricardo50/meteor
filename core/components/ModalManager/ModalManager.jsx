// @flow
import React, { useReducer } from 'react';
import Dialog from '@material-ui/core/Dialog';

import ModalManagerContext from './ModalManagerContext';
import DialogComponents from './DialogComponents';

type ModalManagerProps = {};

const initialState = { activeModal: null };

let id = 0;

const openFirstModal = (state, { payload: modals }) => {
  let firstModal;

  if (modals.length === 0) {
    throw new Error('Cannot pass an empty array to ModalManager');
  }

  const newState = modals.reduce((obj, modal, index) => {
    const modalId = id;

    if (index === 0) {
      firstModal = modalId;
    }

    id += 1;
    return { ...obj, [modalId]: modal };
  }, state);

  return { ...newState, activeModal: firstModal };
};

const reducer = (state, action) => {
  switch (action.type) {
  case 'OPEN_MODAL': {
    if (Array.isArray(action.payload)) {
      return openFirstModal(state, action);
    }

    const modalId = id;
    id += 1;
    if (state.activeModal === null) {
      return { ...state, [modalId]: action.payload, activeModal: modalId };
    }
    return { ...state, [modalId]: action.payload };
  }
  case 'CLOSE_MODAL': {
    const {
      [action.payload.activeModal]: removedModal,
      activeModal,
      ...newState
    } = state;
    const pendingModals = Object.keys(newState);
    if (pendingModals.length > 0) {
      const nextModal = Math.min(...pendingModals);
      return {
        ...newState,
        activeModal: nextModal,
        [nextModal]: {
          ...newState[nextModal],
          returnValue: action.payload.returnValue,
        },
      };
    }
    return { ...newState, activeModal: null };
  }
  case 'CLOSE_ALL': {
    return initialState;
  }

  default:
    return state;
  }
};

const ModalManager = ({ children }: ModalManagerProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { activeModal } = state;
  const {
    title,
    actions,
    description,
    content,
    important = false,
    ...dialogProps
  } = state[activeModal] || {};

  const openModal = (payload) => {
    dispatch({ type: 'OPEN_MODAL', payload });
  };

  const closeModal = returnValue =>
    dispatch({ type: 'CLOSE_MODAL', payload: { activeModal, returnValue } });

  const closeAll = () => dispatch({ type: 'CLOSE_ALL' });

  return (
    <ModalManagerContext.Provider value={{ openModal }}>
      {children}
      <Dialog
        disableBackdropClick={important}
        disableEscapeKeyDown={important}
        {...dialogProps}
        open={activeModal !== null}
        onClose={closeModal}
      >
        <DialogComponents
          returnValue={state[activeModal] && state[activeModal].returnValue}
          dialogContent={state[activeModal]}
          closeModal={closeModal}
          closeAll={closeAll}
        />
      </Dialog>
    </ModalManagerContext.Provider>
  );
};

export default ModalManager;
