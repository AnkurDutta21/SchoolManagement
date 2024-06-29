import React, { createContext, useContext, useReducer } from 'react';

const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';

const initialState = {
  isOpen: false,
  modalType:'',
  modalData:'',
};

const modalReducer = (state, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        isOpen: true,
        modalType: action.payload.modalType,
        modalData:action.payload.modalData,
      };
    case CLOSE_MODAL:
      return {
        isOpen: false,
        modalType: null,
        modalData:null,
      };
    default:
      return state;
  }
};

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalState, dispatch] = useReducer(modalReducer, initialState);

  const openModal = (modalType,modalData) => {
    dispatch({ type: OPEN_MODAL, payload: {modalType,modalData} });
  };

  const closeModal = () => {
    dispatch({ type: CLOSE_MODAL });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
