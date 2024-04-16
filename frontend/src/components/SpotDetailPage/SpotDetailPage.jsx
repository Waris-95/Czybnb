import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getASpotThunk } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import SpotReviews from "../SpotReviews/SpotReviews";
import "./SpotDetailPage.css";

function SpotDetailsPage() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spotObj = useSelector((state) => state.spots);
  const reviewsObj = useSelector((state) => state.reviews);
  const reviews = Object.values(reviewsObj);
  const [isLoaded, setIsLoaded] = useState(false)
  const [setErrors] = useState({});
  const spot = spotObj[spotId]
  let previewImageUrl;

  useEffect(() => {
    const res = async () => {
      try {
        await dispatch(getASpotThunk(spotId));
      } catch (e) {
        const errorsOBJ = {};
        errorsOBJ.status = e.status;
        errorsOBJ.statusText = e.statusText
        setIsLoaded(true)
        setErrors(errorsOBJ);
      }
    }

    res()
  }, [dispatch, spotId]);

  const handleClick = (e) => {
    e.preventDefault();

    alert("Feature Coming Soon...");
  };

  if (isLoaded && !spot?.Owner) return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <h1 style={{ fontFamily: "Avenir" }}>404 Does Not Exist</h1>
    </div>
  );

  if (!spot?.Owner) return  null
console.log(spot) // LOG ADDED

  const spotImages = spot.SpotImages

  if (spotImages.length < 5) {
    for (let i = spot.SpotImages.length; i < 5; i++) {
      const img = {
        id: i + 1,
        url: "https://www.ewingoutdoorsupply.com/media/catalog/product/placeholder/default/shutterstock_161251868.png",
      };
      spot.SpotImages.push(img);
    }
  }

  previewImageUrl = spotImages.find(img => img.preview === true)
  const indexOfPreview = spotImages.indexOf(previewImageUrl)

  const smallImages = [];

  for (let i = 0; i < spotImages.length; i++) {
    const img = spotImages[i];

    if (i === indexOfPreview) continue;

    smallImages.push(img)
  }

  // console.log(errors)

    let spotRating;
    if (reviews.length) {
      spotRating =
        reviews.reduce((acc, curr) => acc + curr.stars, 0) / reviews.length;
    }

    const price = parseFloat(spot.price)

  return (
    <>
      <div className="spot-details">
        <div className="spot-details-header">
          <h2 style={{ marginBottom: "12px" }}>{spot.name}</h2>
          <span>
            {spot.city}, {spot.state}, {spot.country}
          </span>
        </div>
        <div className="spot-details-images">
  {/* Add null check for previewImageUrl */}
  {previewImageUrl && (
    <img className="small-image first-img" src={previewImageUrl.url} />
  )}
  {/* Add null checks for smallImages */}
  {smallImages.length > 0 && (
    <>
      <img className="small-image second-img" src={smallImages[0].url} />
      <img className="small-image third-img" src={smallImages[1].url} />
      <img className="small-image fourth-img" src={smallImages[2].url} />
      <img className="small-image fifth-img" src={smallImages[3].url} />
    </>
  )}
</div>
        <div className="spot-details-info">
          <div className="spot-owner-description">
            <h2 style={{ margin: "0" }}>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </h2>
            <p style={{ fontSize: "14px", overflowWrap: "break-word" }}>{spot.description}</p>
          </div>
          <div className="spot-booking-tile">
            <div className="spot-price-review">
              <span style={{ fontWeight: "500" }} id="spot-price">
                <i>${price.toFixed(2)}</i> night
              </span>
              {reviews.length ? (
                <p>
                  <i className="fa-solid fa-star "></i>
                  {spotRating.toFixed(1)} · {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </p>
              ) : (
                <p>
                  <i className="fa-solid fa-star"></i>
                  New
                </p>
              )}
            </div>
            <div className="reserve-spot">
              <button id="reserve-button" onClick={handleClick}>
                Reserve
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <span
            style={{
              borderBottom: "4px solid black",
              width: "100%",
              margin: "7px 0 0 0",
              borderRadius: "10px",
            }}
          ></span>
        </div>
        <div className="spot-review">
          <SpotReviews spot={spot} />
        </div>
      </div>
    </>
  );
}

export default SpotDetailsPage;