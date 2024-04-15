import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // Import FaStar icon

export default function SpotTile({ spot }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/spots/${spot.id}`);
    };

    const price = parseFloat(spot.price);

    return (
        <div className="spot-tile" title={spot.name} onClick={handleClick}>
            <img
                id="spot-img"
                style={{ objectFit: "cover" }}
                src={spot.previewImage}
            />
            <div className="spot-text">
                <div className="spot-text-details">
                    <span
                        style={{ maxWidth: "100%" }}
                    >{`${spot.city}, ${spot.state}`}</span>
                    <p id="spot-reviews">
                        {/* Use FaStar icon */}
                        <FaStar />
                        {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
                    </p>
                </div>
                <p id="spot-price">
                    <span style={{ fontWeight: "900" }}>${price.toFixed(2)}</span> night
                </p>
            </div>
        </div>
    );
}
