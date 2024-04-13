import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersSpotsThunk } from '../../store/spots';
import SpotTile from '../SpotTile/SpotTile';
import './UserSpots.css';
import { useNavigate } from 'react-router-dom';
import DeleteASpotModal from '../DeleteASpotModal/DeleteASpotModal';
import OpenModalButton from '../OpenModalButton';

function UserSpot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const spotObj = useSelector((state) => state.spots); // Get the entire spots object
  const spots = spotObj ? Object.values(spotObj) : []; // Extract values only if spotObj is defined

  useEffect(() => {
    if (user) dispatch(getUsersSpotsThunk());
  }, [dispatch, user]);

  const createASpot = (e) => {
    e.preventDefault();
    navigate('/spots/new');
  };

  const updateASpot = (e, spot) => {
    e.preventDefault();
    navigate(`/spots/${spot.id}/edit`);
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="manage-spots-container">
      <div className="manage-spots-header">
        <h2 style={{ margin: '10px 0' }}>Manage Your Spots</h2>
        <button
          style={{
            border: 'none',
            backgroundColor: 'white',
            color: 'black',
            padding: '10px 20px',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            margin: '4px 2px',
            cursor: 'pointer',
            borderRadius: '12px',
          }}
          onClick={createASpot}
        >
          Create a New Spot
        </button>
        <div className="manage-spots-tiles-container">
          {spots.length > 0 && (
            <div className="manage-spot-tiles">
              {spots.map((spot) => (
                <div className="individual-tiles" key={spot.id}>
                  <SpotTile spot={spot} />
                  <button
                    style={{
                      cursor: 'pointer',
                      margin: '60px 10px 10px 10px',
                      backgroundColor: 'gray',
                      color: 'white',
                      boxShadow: '2px 2px 2px black',
                    }}
                    onClick={(e) => updateASpot(e, spot)}
                  >
                    Update
                  </button>
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteASpotModal spot={spot} />}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSpot;
