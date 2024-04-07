import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';

// Define a simple reducer
const exampleReducer = (state = {}, action) => {
  switch (action.type) {
    case 'HELLO':
      return { ...state, message: 'Hello, Redux!' };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  example: exampleReducer,
  session: sessionReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// Configure store function
const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
