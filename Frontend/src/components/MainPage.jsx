import UserTab from './UserTab';
import MediaPreviewer from './MediaPreviewer';
import TimelineEditor from './TimelineEditor';
import ThemeToggle from './ThemeToggle';
import { Upload, Save } from 'lucide-react';
import '../styles/MainPage.css';
import logo from '../assets/logo.png';

const MainPage = () => {
  return (
    <div className="main-container">
      <header className="top-bar">
        <div className="logo">
          <img src={logo} alt="Helios Logo" className="logo-img" />
          <h2>Helios</h2>
        </div>
        <div className="top-nav">
          <button className="nav-button">
            <Save size={18} />
            <span>Save</span>
          </button>
          <button className="nav-button">
            <Upload size={18} />
            <span>Export</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="content-area">
        <div className="left-panel">
          <UserTab />
        </div>

        <div className="right-panel">
          <div className="upload-section">
            <MediaPreviewer />
          </div>
          <div className="timeline-section">
            <TimelineEditor />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
