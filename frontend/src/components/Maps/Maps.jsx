import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px',
};

const center = {
  lat: 38.9072,
  lng: 77.0369,
};

const Maps = ({ apiKey }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });
  console.log(Maps)

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        />
      )}
    </>
  );
};

export default Maps;