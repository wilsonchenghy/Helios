import UserTab from './UserTab';
import MediaPreviewer from './MediaPreviewer';
import TimelineEditor from './TimelineEditor';
import ThemeToggle from './ThemeToggle';
import { Upload } from 'lucide-react';
import '../styles/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-container">
      <header className="top-bar">
        <div className="logo">
          <h2>Helios</h2>
        </div>
        <div className="top-nav">
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
