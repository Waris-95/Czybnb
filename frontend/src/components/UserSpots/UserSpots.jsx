import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getUsersSpotsThunk } from "../../store/spots";
import SpotTile from "../SpotTile";
import "./UserSpots.css";
import { useNavigate } from "react-router-dom";
import DeleteASpotModal from "../DeleteASpotModal";
import OpenModalButton from "../OpenModalButton";

function UserSpot() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const spotsObj = useSelector((state) => state.spots);
    const spots = Object.values(spotsObj);

    useEffect(() => {
        if (user) dispatch(getUsersSpotsThunk())
    }, [dispatch])

    const createASpot = (e) => {
        e.preventDefault();
        navigate("/spots/new");
    }

    const updateASpot = (e, spot) => {
        e.preventDefault();
        navigate(`/spots/${spot.id}/edit`);
    } 

    if (!user) {
        navigate('/')
        return
    }


  return (
    <div className='manage-spots-container'>
        <div className='manage-spots-header'>
            <h2 style={{ margin: "10px 0" }}>Manage Your Spots</h2>
            <button
            style={{
                border: "none",
                backgroundColor: "white",
                color: "black",
                padding: "10px 20px",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "16px",
                margin: "4px 2px",
                cursor: "pointer",
                borderRadius: "12px",
            }} 
            onClick={createASpot}
            >
                Create a New Spot
            </button>
        </div>
      
    </div>
  )
}

export default UserSpot
