
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spots';
import "./CreateSpotForm.css";
import { createImage } from '../../store/spots';

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    // const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");
    const [image5, setImage5] = useState("");
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price,
        }

        let createdSpot;
        setErrors({});

        createdSpot = await dispatch(createSpot(payload))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });

        let imagesDone;

        if (createdSpot) {
            let imagesArr = [image1, image2, image3, image4, image5];
            let images = imagesArr.filter(image => image !== "")

            images.push(createdSpot.id);

            imagesDone = await (dispatch(createImage(images)))
                .catch(async (res) => {
                    const data = await res.json();

                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }

        if (createdSpot && imagesDone) {
     
            navigate(`/spots/${createdSpot.id}`);   // ????????
        }

    } // end handle submit

    return (
        <>
            <div className='create-spot-container'>
                <div className='create-spot-wrapper'>
                    <h2>Create a new Spot</h2>
                    <form onSubmit={handleSubmit}>
                    <h3>Where&apos;s your place located?</h3>
                            <p>Guests will only get your exact address once they booked a reservation.</p>

                        <div className='create-spot-location'>
                            <label><span>{errors.country && <p className='create-spot-error'>{errors.country}</p>}</span></label>
                                <input
                                    type="text"
                                    value={country}
                                    placeholder="Country"
                                    onChange={(e) => setCountry(e.target.value)}
                                required
                                />

                            {/* {errors.country && <p className='create-spot-error'>{errors.country}</p>} */}
                            <label><span>{errors.address && <p className='create-spot-error'>{errors.address}</p>}</span></label>
                                <input
                                    type="text"
                                    value={address}
                                    placeholder="Address"
                                    onChange={(e) => setAddress(e.target.value)}
                                required
                                />
                             <span>{errors.city && <p className='create-spot-error'>{errors.city}</p>}</span>
                            <div className='city-state'>
                            <label></label>
                                <input
                                    type="text"
                                    value={city}
                                    placeholder="City"
                                    onChange={(e) => setCity(e.target.value)}
                                required
                                />
                           <span> , </span>

                            <label></label>
                                <input
                                    type="text"
                                    value={state}
                                    placeholder="STATE"
                                    onChange={(e) => setState(e.target.value)}
                                required
                                />
                            </div>
                            <span className='create-spot-error' id="state-error">{errors.state && <p>{errors.state}</p>}</span>
                            <div className='long-lat'>
                            <label> <span className='create-spot-error'>{errors.lat && <p>{errors.lat}</p>}</span></label>
                                <input
                                    type="text"
                                    value={lat}
                                    placeholder="Latitude"
                                    onChange={(e) => setLat(e.target.value)}
                                />
                          <span> , </span>
                            <label><span className='create-spot-error'>{errors.lng && <p>{errors.lng}</p>}</span></label>
                                <input
                                    type="text"
                                    value={lng}
                                    placeholder="Longitude"
                                    onChange={(e) => setLng(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <h3>Describe your place to your guests</h3>
                            <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                            <textarea
                                rows={4} cols={40}
                                minLength="30"
                                value={description}
                                placeholder="Please write at least 30 characters"
                                onChange={(e) => setDescription(e.target.value)}
                            required
                            />
                            <div>{errors.description && <p className='create-spot-error'>{errors.description}</p>}</div>

                        </div>
                        <div>
                            <h3>Create a title for your spot</h3>
                            <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                            <input
                                type="text"
                                value={name}
                                placeholder="Name of your spot"
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <p className='create-spot-error'>{errors.name}</p>}
                        </div>
                        <div>
                            <h3>Set a base price for your spot</h3>
                            <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                            <input
                                type="number"
                                placeholder="Price per night (USD)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            required
                            />
                            {errors.price && <p className='create-spot-error'>{errors.price}</p>}
                        </div>
                        <div>
                            <h3>Liven up your spot with photos</h3>
                            <p>Submit a link to at least one photo to publish your spot.</p>
                            <div className='create-spot-images'>
                            <input
                                type="text"
                                value={image1}
                                placeholder="Preview Image URL"
                                onChange={(e) => setImage1(e.target.value)}
                            required
                            />
                            <input
                                type="text"
                                value={image2}
                                placeholder="Image URL"
                                onChange={(e) => setImage2(e.target.value)}
                            />
                            <input
                                type="text"
                                value={image3}
                                placeholder="Image URL"
                                onChange={(e) => setImage3(e.target.value)}
                            />
                            <input
                                type="text"
                                value={image4}
                                placeholder="Image URL"
                                onChange={(e) => setImage4(e.target.value)}
                            />
                            <input
                                type="text"
                                value={image5}
                                placeholder="Image URL"
                                onChange={(e) => setImage5(e.target.value)}
                            />
                            </div>
                        </div>
                        <div className='create-spot-button'>
                        <button style={{color: "white"}} type="submit">Create Spot</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

};

export default CreateSpotForm;