import React, { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="nav-button theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? (
        <>
          <Moon size={18} />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun size={18} />
          <span>Light</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle; 