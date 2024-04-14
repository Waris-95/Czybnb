import "./DeleteASpot.css";
import { useModal } from '../../context/Modal'
import { useDispatch } from 'react-redux';
import { deleteASpotThunk } from '../../store/spots'
import { useNavigate } from "react-router-dom";

function DeleteASpotModal({ spot }) {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { closeModal } = useModal(); 

    const deleteSpot = (e) => {
        e.preventDefault();

        dispatch(deleteASpotThunk(spot.id).then(closeModal));
        navigate('/spots/current');
    };

  return (
    <div className="delete-spot-modal">
        <h1>confirm Delete</h1>
        <span id="delete-spot-span">
            <p>Are you sure you want to delete this spot?</p>
        </span>
        <button className="confirm-delete" style={{ cursor: "pointer"}}onClick={deleteSpot}>
            Yes (Delete Spot)
        </button>
        <button className="do-not-delete" style={{ cursor: "pointer"}}onClick={closeModal}>
            No (Keep Spot)
        </button>
    </div>
  )
}

export default DeleteASpotModal
