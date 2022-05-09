import { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { loadState } from "./localStorage";
let store;

const persistedState = loadState();

const initialState = persistedState || {
  isOpenedWrapper: false,
  isLogin: true,
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "TOGGLE_OPENED_WRAPPER":
      return {
        ...state,
        isOpenedWrapper: !state.isOpenedWrapper,
      };
    case "SET_IS_LOGIN":
      return {
        ...state,
        isLogin: payload,
      };

    default:
      return state;
  }
};

function initStore(preloadedState = initialState) {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  );
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);
  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
