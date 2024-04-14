import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import CreateSpotForm from "./components/CreateSpotForm/CreateSpotForm";
import UserSpot from './components/UserSpots/UserSpots';
import EditASpot from "./components/EditASpot/EditASpot";
import SpotDetailPage from "./components/SpotDetailPage/SpotDetailPage";
import AllSpot from "./components/AllSpot/AllSpot";
import Footer from "./components/Footer/Footer"; 

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <AllSpot />,
      },
      {
        path: "spots/new",
        element: <CreateSpotForm />,
      },
      {
        path: "spots/current",
        element: <UserSpot />,
      },
      {
        path: "spots/:spotId/edit",
        element: <EditASpot />,
      },
      {
        path: "spots/:spotId",
        element: <SpotDetailPage />,
      },
      {
        path: "*",
        element: (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h1 style={{ fontFamily: "Avenir" }}>404 Does Not Exist</h1>
          </div>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
