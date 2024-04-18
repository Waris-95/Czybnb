import { csrfFetch } from "./csrf";

// action types as constants
const GET_REVIEWS_FOR_SPOT = "reviews/GET_REVIEWS_FOR_SPOT";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";
const CREATE_REVIEW = "reviews/CREATE_REVIEW"

// action creator function to set user in the state
const getReviewsForSpot = (reviews) => {
    return {
        type: GET_REVIEWS_FOR_SPOT,
        reviews
    }
}

const deleteAReview = (reviewId) => {
    return  {
        type: DELETE_REVIEW,
        reviewId
    }
}

const createAReview = (review) => {
    return {
        type: CREATE_REVIEW,
        review
    }
}

// Corrected createAReviewThunk function
export const createAReviewThunk = (spotId, review, user) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...review, userId: user.id }) // Include userId in the review object
    });

    if (res.ok) {
        const rev = await res.json();
        rev.User = user;
        dispatch(createAReview(rev));
        return rev;
    }
};


export const getReviewsForSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
        const reviews = await res.json();
        dispatch(getReviewsForSpot(reviews));
        return reviews
    }
}

export const deleteAReviewThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
  });


  if (res.ok) {
    const confirm = await res.json();
    dispatch(deleteAReview(reviewId));
    return confirm
  }
};


// reducer
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_REVIEWS_FOR_SPOT: {
            const newState = {};
            action.reviews.Reviews.forEach(review => {
                newState[review.id] = review
            })
            return newState
        }
        case DELETE_REVIEW: {
            const newState = { ...state }
            delete newState[action.reviewId];
            return newState;
        }
        case CREATE_REVIEW: {
            const newState = { ...state }
            newState[action.review.id] = action.review;
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default reviewsReducer;