// DarkMode.jsx
import { useTheme } from "../../context/ThemeContext";
import './DarkMode.css'

const DarkMode = () => {
  const { themeName, toggleTheme } = useTheme();

  return (
    <div className={`dark_mode ${themeName}`}>
      <input
        className='dark_mode_input'
        type='checkbox'
        id='darkmode-toggle'
        checked={themeName === "dark"}
        onChange={toggleTheme}
      />
      <label className='dark_mode_label' htmlFor='darkmode-toggle'>
        {/* Your moon and sun icons */}
      </label>
    </div>
  );
};

export default DarkMode;

