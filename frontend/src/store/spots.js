import { csrfFetch } from "./csrf";

// action types as constants
const ALL_SPOTS = "spots/ALL_SPOTS";
const SPOT_DETAILS = "spots/SPOT_DETAILS";
const CREATE_SPOT = "spots/CREATE_SPOT";
// const USERS_SPOTS = "spots/USERS_SPOTS";
const DELETE_SPOT = "spots/DELETE_SPOT";

// action creator function to set user in the state
const getAllSpots = (spots) => {
  return {
    type: ALL_SPOTS,
    spots,
  };
};

const getASpot = (spot) => {
  return {
    type: SPOT_DETAILS,
    spot,
  };
};

const createASpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot,
  };
};

const deleteASpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

// async action creator for user login
export const deleteASpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const confirm = await res.json();
    dispatch(deleteASpot(spotId));
    return confirm;
  }
};

export const editASpotAThunk = (spotId, payload) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  // console.log(res)

  if (res.ok) {
    const spot = await res.json();
    dispatch(createASpot(spot));
    return spot;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const getUsersSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");

  // console.log(res);

  if (res.ok) {
    const spots = await res.json();
    // console.log(spots)
    dispatch(getAllSpots(spots));
    return spots;
  }
};

export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");

  if (res.ok) {
    const spots = await res.json();
    dispatch(getAllSpots(spots));
    return spots;
  }
};

export const getASpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const spot = await res.json();
    dispatch(getASpot(spot));
    return spot;
  }
};

export const createASpotThunk = (payload) => async (dispatch) => {
  console.log('store',payload)
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    const spot = await res.json();
    dispatch(createASpot(spot));
    return spot;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const addSpotImagesThunk = (spotId, spotImages) => async () => {
  // console.log('in thunk', spotImages);
  spotImages.forEach(async (img) => {
    await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      body: JSON.stringify(img),
    });
  });
};


// spots reducer
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_SPOTS: {
      const newState = {};
      action.spots.Spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case SPOT_DETAILS: {
      return { ...state, [action.spot.id]: action.spot };
    }
    case CREATE_SPOT: {
      return {
        ...state,
        [action.spot.id]: action.spot,
      };
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default spotsReducer;