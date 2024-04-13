import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import SpotTile from '../SpotTile/SpotTile'
import "./AllSpot.css"

function AllSpots() {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots);
    
    // Check if spotsObj is truthy before accessing its values
    const spots = spotsObj ? Object.values(spotsObj) : [];

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch])

    if (!spots.length) return null

    return (
        <div className="all-spots-container">
            {spots.map((spot) => (
                <div className="single-spot-tile" key={spot.id}>
                    <SpotTile spot={spot} />
                </div>
            ))}
        </div>
    )
}

export default AllSpots;
