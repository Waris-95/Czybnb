import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaBars } from 'react-icons/fa'; // Import FaBars for the hamburger icon
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navigation.css'; 

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = () => {
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {/* Container for the icons */}
      <div className="icon-container" onClick={toggleMenu}>
        <div className="icon-wrapper">
          {/* Hamburger Icon */}
          <div className="hamburger-icon">
            <FaBars />
          </div>
          {/* User Icon */}
          <div className="user-logo">
            <FaUserCircle />
          </div>
        </div>
      </div>

      {/* User menu */}
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.username && ` ${user.username}`}</li> {/* Add the greeting here */}
            <li>{user.email}</li>
            <li>
              <Link to="/spots/current" onClick={closeMenu}>Manage Spots</Link>
            </li>
            <li>
              <Link to="/" onClick={logout}>Log Out</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
