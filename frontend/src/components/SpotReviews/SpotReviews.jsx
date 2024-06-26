import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsForSpotThunk } from "../../store/review";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteAReviewModal from "../DeleteAReviewModal/DeleteAReview";
import CreateAReviewModal from "../CreateReviewModal/CreateAReview";
import { FaStar } from "react-icons/fa"; // Import FaStar icon
import "./SpotReviews.css";

function SpotReviews({ spot }) {
  const months = {
    1: 'Jan',
    2: "Feb",
    3: "Mar",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "Aug",
    9: "Sept",
    10: "Oct",
    11: "Nov",
    12: "Dec"
  }

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = months[date.getMonth() + 1]; // Adding 1 because months are zero-based
    return `${month} ${year}`;
  };

  const user = useSelector((state) => state.session.user);
  const reviewsObj = useSelector((state) => state.reviews);
  const reviews = Object.values(reviewsObj);
  const dispatch = useDispatch();

  reviews.sort((a, b) => {
    const date1 = new Date(a.createdAt);
    const date2 = new Date(b.createdAt);
    return date2 - date1;
  });

  useEffect(() => {
    dispatch(getReviewsForSpotThunk(spot.id));
  }, [dispatch, spot.id]);

  let spotRating;
  if (reviews.length) {
    spotRating =
      reviews.reduce((acc, curr) => acc + curr.stars, 0) / reviews.length;
  }

  let alreadyReviewed
  if (user) {
    alreadyReviewed = reviews.find(review => review.userId === user.id)
  }

  return (
    <div className="reviews-container">
      <div className="spot-reviews-header">
        {reviews.length > 0 ? (
          <span style={{ fontSize: "25px" }}>
            <FaStar /> {spotRating.toFixed(1)} · {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </span>
        ) : (
          <span style={{ fontSize: "25px" }}>
            <FaStar /> New
          </span>
        )}
      </div>
      {user && user.id !== spot.ownerId && !alreadyReviewed && (
        <>
          <span style={{ marginTop: "15px" }}></span>
          <OpenModalButton
            buttonText={"Post Your Review"}
            modalComponent={<CreateAReviewModal spot={spot} />}
          />
        </>
      )}
      <span style={{ marginTop: "7px" }}></span>
      {reviews.length > 0 ? (
        <div className="reviews">
          {reviews.map((review) => (
            <div className="individual-review" key={review.id}>
              <span id="review-firstName">{review.User ? review.User.firstName : user.firstName}</span>
              <span id="review-date">
                {formatDate(review.createdAt)}
              </span>
              <p
                style={{
                  margin: "0",
                  marginBottom: "10px",
                  overflowWrap: "break-word",
                }}
              >
                {review.review}
              </p>
              {user && user.id === review.userId && (
                <OpenModalButton
                  buttonText={"Delete"}
                  modalComponent={<DeleteAReviewModal review={review} />}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <span id="review-firstName">Be the first to post a review!</span>
      )}
    </div>
  );
}

export default SpotReviews;
