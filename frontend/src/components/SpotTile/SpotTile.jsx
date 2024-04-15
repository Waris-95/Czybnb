import { useNavigate } from 'react-router-dom';

export default function SpotTile({ spot }) {
	const navigate = useNavigate();
	// console.log(spot)

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
					{spot.avgRating ? (
						<p id="spot-reviews">
							<i className="fa-solid fa-star"></i>
							{spot.avgRating.toFixed(1)}
						</p>
					) : (
						<p id="spot-reviews">New</p>
					)}
				</div>
				<p id="spot-price">
					<span style={{ fontWeight: "900" }}>${price.toFixed(2)}</span> Night
				</p>
			</div>
		</div>
	);
}
