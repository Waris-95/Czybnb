import { csrfFetch } from './csrf';

// action types as constants
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// action creator function to set user in the state
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};
// action creator function to remove user from the state
const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

// async action creator for user login
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// async action creator for user logout
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
}

// async action creator for user signup
export const signup = (user) => async (dispatch) => {
  try {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password
      })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } catch (err) {
    const dataErr = await err.json()
    console.log(dataErr)
  }
}

// initial state for the session slice of the redux store
const initialState = { user: null };

// reducer func for handling session-related actions
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
