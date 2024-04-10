import { csrfFetch } from './csrf';

//action types
const ALL_SPOTS = "spots/ALL_SPOTS";
const SPOT_DETAILS = "spots/SPOT_DETAILS";
const CREATE_SPOT = "spots/CREATE_SPOT";
const USERS_SPOTS = "spots/USERS_SPOTS";
const DELETE_SPOT = "spots/DELETE_SPOT";

//action creators
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

const deleteASpot = (spot) => {
    return {
        type: DELETE_SPOT,
        spotId,
    };
};


//thunks
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

  export const editASpotThunk = (spotId, payload) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const spot = await res.json();
      dispatch(createASpot(spot));
      return spot;
    } else {
      const error = await res.json();
      return error;
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

export const addSpotImagesThunk = (spotId, spotImages) => async (dispatch) => {
    // console.log('in thunk', spotImages);
    spotImages.forEach(async (img) => {
      await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        body: JSON.stringify(img),
      });
    });
  };
  
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