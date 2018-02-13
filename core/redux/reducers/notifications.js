const initialState = [];

const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const POP_NOTIFICATION = 'POP_NOTIFICATION';

const notifications = (state = initialState, { type, notification }) => {
  switch (type) {
  case ADD_NOTIFICATION:
    return [...state, notification];
  case POP_NOTIFICATION:
    return [...state.slice(1)];
  default:
    return state;
  }
};

export default notifications;
