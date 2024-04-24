import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import CreateSpotForm from "./components/CreateSpotForm/CreateSpotForm";
import UserSpot from './components/UserSpots/UserSpots';
import EditASpot from "./components/EditASpot/EditASpot";
import SpotDetailPage from "./components/SpotDetailPage/SpotDetailPage";
import AllSpot from "./components/AllSpot/AllSpot";
import Footer from "./components/Footer/Footer"; 
import { FaExclamationCircle } from 'react-icons/fa';
// import DarkMode from './components/DarkMode/DarkMode';

// Custom silly 404 component
function Silly404() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				flexDirection: "column",
			}}
		>
			<div style={{ textAlign: "center" }}>
				<FaExclamationCircle style={{ fontSize: "4rem", color: "red" }} />
				<h1 style={{ fontFamily: "Avenir" }}>404 - Page Not Found</h1>
				<p>Oops! The page you&apos;re looking for does not exist.</p>
				<Link to="/">Go Home</Link>
			</div>
		</div>
	);
}

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
      {/* <DarkMode />  */}
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
				element: <Silly404 />,
			},
		],
	},
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
