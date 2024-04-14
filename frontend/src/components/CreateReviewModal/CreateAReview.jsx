import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useModal } from "../../context/Modal";
import { createAReviewThunk } from "../../store/review";
import "./CreateAReview.css";

function CreateAReviewModal({ spot }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const { closeModal } = useModal();
  const [reviewText, setReviewText] = useState("");
  const [activeRating, setActiveRating] = useState(0);
  const [rating, setRating] = useState(0)
  const disabled = reviewText.length < 10 || rating === 0;
  const className = disabled ? "not-confirmed-review" : "confirm-review";
  const [ errors, setErrors ] = useState({})

  // console.log(user)

  const onChange = (number) => {
    setRating(parseInt(number));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorsObj = {};

    const review = {
      review: reviewText,
      stars: rating
    }

    if (reviewText.length > 255) errorsObj.review = "Review must be shorter than 255 characters"
    if (rating < 1 || rating > 5) errorsObj.stars = "Please select your stars"

    if (!Object.keys(errorsObj).length) {
      dispatch(createAReviewThunk(spot.id, review, user)).then(() => closeModal());
    }

    setErrors(errorsObj);
  };


  // console.log(rating);
  return (
    <div className="create-a-review-modal">
      <h1 style={{ marginBottom: "5px" }}>How was your stay?</h1>
      {errors.review && (
        <p
          style={{
            fontSize: "12px",
            color: "red",
            marginTop: "0",
          }}
        >
          *{errors.review}
        </p>
      )}
      {errors.stars&& (
        <p
          style={{
            fontSize: "12px",
            color: "red",
            marginTop: "0",
          }}
        >
          *{errors.stars}
        </p>
      )}
      <textarea
        id="review-text"
        rows="8"
        name="review"
        placeholder="Leave your review here..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <div className="rating-input">
        <div
          onMouseEnter={() => {
            setActiveRating(1);
          }}
          onMouseLeave={() => {
            setActiveRating(rating);
          }}
          onClick={() => {
            onChange(1);
          }}
        >
          <i
            className={
              activeRating >= 1 || rating >= 1
                ? "fa-solid fa-star"
                : "fa-regular fa-star"
            }
          ></i>
        </div>
        <div
          onMouseEnter={() => {
            setActiveRating(2);
          }}
          onMouseLeave={() => {
            setActiveRating(rating);
          }}
          onClick={() => {
            onChange(2);
          }}
        >
          <i
            className={
              activeRating >= 2 || rating >= 2
                ? "fa-solid fa-star"
                : "fa-regular fa-star"
            }
          ></i>
        </div>
        <div
          onMouseEnter={() => {
            setActiveRating(3);
          }}
          onMouseLeave={() => {
            setActiveRating(rating);
          }}
          onClick={() => {
            onChange(3);
          }}
        >
          <i
            className={
              activeRating >= 3 || rating >= 3
                ? "fa-solid fa-star"
                : "fa-regular fa-star"
            }
          ></i>
        </div>
        <div
          onMouseEnter={() => {
            setActiveRating(4);
          }}
          onMouseLeave={() => {
            setActiveRating(rating);
          }}
          onClick={() => {
            onChange(4);
          }}
        >
          <i
            className={
              activeRating >= 4 || rating >= 4
                ? "fa-solid fa-star"
                : "fa-regular fa-star"
            }
          ></i>
        </div>
        <div
          onMouseEnter={() => {
            setActiveRating(5);
          }}
          onMouseLeave={() => {
            setActiveRating(rating);
          }}
          onClick={() => {
            onChange(5);
          }}
        >
          <i
            className={
              activeRating >= 5 || rating >= 5
                ? "fa-solid fa-star"
                : "fa-regular fa-star"
            }
          ></i>
        </div>
        <span style={{ fontSize: "15px", marginLeft: "5px" }}>Stars</span>
      </div>
      <button className={className} disabled={disabled} onClick={handleSubmit}>
        Submit Your Review
      </button>
    </div>
  );
}

export default CreateAReviewModal;