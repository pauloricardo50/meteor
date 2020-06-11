import { useCallback, useReducer } from 'react';

export const STATES = {
  ERROR: 'ERROR',
  LOADING: 'LOADING',
  IDLE: 'IDLE',
};

export const EVENTS = {
  ERROR: 'ERROR',
  LOAD: 'LOAD',
  SUCCESS: 'SUCCESS',
};

const stateMachine = (state, action) => {
  switch (action.type) {
    case EVENTS.ERROR: {
      return {
        ...state,
        data: null,
        error: action.payload,
        status: STATES.ERROR,
      };
    }
    case EVENTS.LOAD: {
      return {
        ...state,
        error: null,
        status: STATES.LOADING,
      };
    }
    case EVENTS.SUCCESS: {
      return {
        ...state,
        data: action.payload,
        config: action.config,
        error: null,
        status: STATES.IDLE,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const useAsyncStateMachine = () => {
  const [state, dispatch] = useReducer(stateMachine, {
    data: undefined,
    error: null,
    status: STATES.LOADING,
  });

  const setLoading = useCallback(() => dispatch({ type: EVENTS.LOAD }), []);
  const setError = useCallback(
    error => dispatch({ type: EVENTS.ERROR, payload: error }),
    [],
  );
  const setData = useCallback(
    (data, config) => dispatch({ type: EVENTS.SUCCESS, payload: data, config }),
    [],
  );

  return {
    ...state,
    dispatch,
    isLoading: state.status === STATES.LOADING,
    setLoading,
    setError,
    setData,
  };
};

export default useAsyncStateMachine;
