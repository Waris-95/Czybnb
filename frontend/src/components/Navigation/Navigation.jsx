import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header className="nav">
      <div className='snorebnb'>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <div className='logo-name'>
            <img src="https://th.bing.com/th/id/R.b7f80dcd01c55a674190e186889c21ac?rik=EG4su3o873VEfA&riu=http%3a%2f%2fwww.clker.com%2fcliparts%2fb%2fK%2f7%2fU%2fh%2fz%2fred-house-hi.png&ehk=CG96yp5ZOvVdB0Oyi2AEvY%2f3A1z1gWYiGhOw5zpWPFM%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1" alt="logo" style={{ height: '28px', marginRight: '10px' }} />
            <span>czybnb</span>
          </div>
        </NavLink>
      </div>

      <div className='right-section'>
        {isLoaded && sessionUser && (
          <NavLink to="/spots/new" className="create-new-spot-main">Create a New Spot</NavLink>
        )}
        <ProfileButton user={sessionUser} />
      </div>
    </header>
  );
}

export default Navigation;
