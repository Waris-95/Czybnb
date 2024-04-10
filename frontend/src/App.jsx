import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
// import AllSpots from './components/AllSpot';
// import SpotDetailsPage from "./components/SpotDetailPage";
import CreateASpot from "./components/CreateASpot/CreateASpot";
import UserSpot from "./components/UserSpots";
// import EditASpot from "./components/EditASpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <Router>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Routes>
          {/* <Route path="/" element={<AllSpots />} /> */}
          <Route path="/spots/new" element={<CreateASpot />} />
          <Route path="/spots/current" element={<UserSpot />} />
          {/* <Route path="/spots/:spotId/edit" element={<EditASpot />} /> */}
          {/* <Route path="/spots/:spotId" element={<SpotDetailsPage />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Router>
  );
}

// Custom 404 Not Found component
function NotFound() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <h1 style={{ fontFamily: "Avenir" }}>404 Not Found</h1>
    </div>
  );
}

export default App;
