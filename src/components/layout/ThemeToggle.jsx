import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Moon Icon - Shows in light mode */}
        <FiMoon
          className={`absolute inset-0 icon-primary dark:text-secondary-400 ${
            isDarkMode ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
          size={24}
        />
        {/* Sun Icon - Shows in dark mode */}
        <FiSun
          className={`absolute inset-0 icon-primary dark:text-yellow-300 ${
            isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          }`}
          size={24}
        />
      </div>
    </button>
  );
}

export default ThemeToggle;
