import { useDispatch } from 'react-redux';
import { deleteASpotThunk } from '../../store/spots';
import { useModal } from '../../context/Modal';
import './DeleteASpot.css';


function DeleteASpotModal({ spot, onDeleteSuccess }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteSpot = async (e) => {
    e.preventDefault();

    try {
      await dispatch(deleteASpotThunk(spot.id));
      onDeleteSuccess(); // Call the callback function provided by the parent
      closeModal();
    } catch (error) {
      console.error('Error deleting spot:', error);
    }
  };

  return (
    <div className="delete-spot-modal">
      <h1>Confirm Delete</h1>
      <span id="delete-spot-span">
        <p>Are you sure you want to delete this spot?</p>
      </span>
      <button className="confirm-delete" onClick={deleteSpot}>
        Yes (Delete Spot)
      </button>
      <button className="do-not-delete" onClick={closeModal}>
        No (Keep Spot)
      </button>
    </div>
  );
}

export default DeleteASpotModal;

