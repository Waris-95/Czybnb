import { useTheme } from '../../context/ThemeContext';
import "./DarkMode.css";

const DarkMode = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className='dark_mode'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                checked={isDarkMode}
                onChange={toggleTheme}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                {/* <Sun />
                <Moon /> */}
            </label>
        </div>
    );
};

export default DarkMode;
