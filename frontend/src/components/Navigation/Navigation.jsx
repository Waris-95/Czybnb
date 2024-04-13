import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {

  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='nav'>
      <div className='snorebnb'>
        <li>
        <NavLink to="/" style={{ textDecoration: "none" }}>

            <div className='logo-name'>
              <img src="https://www.pinclipart.com/picdir/big/58-581778_home-icon-clip-art-interior-design-logo-png.png" alt="logo" style={{ height: '28px', marginRight: '10px' }} />
              <span>CZYBNB</span>
            </div>
          </NavLink>
        </li>
      </div>
      {isLoaded && (
        <>
          {sessionUser && (
            <div className='createspot'>
              <li className='create-spot-container-main'>
                <NavLink to="/spots/new" className="create-new-spot-main">Create a New Spot</NavLink>
              </li>
            </div>
          )}
          <div className='profilelogo'>
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          </div>
        </>
      )}
    </ul>
  );
}

export default Navigation;