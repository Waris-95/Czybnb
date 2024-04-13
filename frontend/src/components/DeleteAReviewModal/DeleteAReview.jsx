import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
// import { deleteASpotThunk } from "../../store/spots";
// import { useNavigate } from "react-router-dom";
import { deleteAReviewThunk } from "../../store/review";

function DeleteAReviewModal({ review }) {
//   const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteReview = (e) => {
    e.preventDefault();

    // console.log(review)
    dispatch(deleteAReviewThunk(review.id)).then(closeModal());

  };

  return (
    <div className="delete-spot-modal">
      <h1>Confirm Delete</h1>
      <span id="delete-spot-span">
        Are you sure you want to delete this review?
      </span>
      <button className="confirm-delete" style={{cursor: "pointer"}}onClick={deleteReview}>
        Yes (Delete Review)
      </button>
      <button className="do-not-delete" style={{cursor: "pointer"}}onClick={closeModal}>
        No (Keep Review)
      </button>
    </div>
  );
}

export default DeleteAReviewModal;