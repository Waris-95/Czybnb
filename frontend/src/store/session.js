import { csrfFetch } from './csrf';

// action types as constants
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const SIGNUP_ERROR = "session/signupError";

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

// action creator function to handle signup errors
const signupError = (error) => {
  return {
    type: SIGNUP_ERROR,
    payload: error
  };
};

// async action creator for user login
export const login = (user) => async (dispatch) => {
  console.log(user)
  const { credential, password } = user;
  console.log(credential,password)
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } else {
   const err = await response.json() 
   throw err
  }
};

// async action creator for user logout
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    // console.log(response);
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

    if (!response.ok) {
      // If response is not ok, handle server-side errors
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } catch (err) {
    // Handle errors, dispatching action for signup errors
    dispatch(signupError(err.message || 'Signup failed'));
    console.error('Signup failed:', err);
    throw err; // Rethrow the error to let the component handle it
  }
};

// async action creator for logout
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE'
  });
  dispatch(removeUser());
  return response;
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
