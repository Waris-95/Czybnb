import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getKey } from '../../store/maps.js';
import Maps from './Maps.jsx';

const MapContainer = ({ lat, lng }) => {
  const key = useSelector((state) => state.maps.key);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(key, '!!!!!!!!!!!!!!!KEYYYYYYYYYY')
    if (!key) {
      dispatch(getKey());
    }
  }, [dispatch, key]);

  if (!key) {
    return null;
  }

  return (
    <>
    <Maps apiKey={key} lat={lat} lng={lng} />
    </>
  );
};

export default MapContainer;
