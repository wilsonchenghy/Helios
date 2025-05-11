import { useState } from 'react';
import AICommandBox from './AICommandBox';
import StockMediaBox from './StockMediaBox';
import '../styles/UserTab.css';

const UserTab = () => {
  const [activeTab, setActiveTab] = useState('stockMedia'); // Default to Stock Media
  const [mediaType, setMediaType] = useState('image'); // Default to image

  const handleSelectChange = (e) => {
    setActiveTab(e.target.value);
  };

  const handleMediaTypeClick = (type) => {
    setMediaType(type);
  };

  return (
    <div className="user-tab-container">
      <div className="tab-header">
        <div className="tab-selector">
          <select
            id="tab-dropdown"
            value={activeTab}
            onChange={handleSelectChange}
            className="tab-dropdown"
          >
            <option value="stockMedia">🔍 Stock Media</option>
            <option value="aiCommand">💫 AI Command</option>
          </select>
        </div>
        
        {activeTab === 'stockMedia' && (
          <div className="media-type-buttons">
            <button 
              className={`media-type-btn ${mediaType === 'image' ? 'active' : ''}`}
              onClick={() => handleMediaTypeClick('image')}
            >
              Images
            </button>
            <button 
              className={`media-type-btn ${mediaType === 'video' ? 'active' : ''}`}
              onClick={() => handleMediaTypeClick('video')}
            >
              Videos
            </button>
            <button 
              className={`media-type-btn ${mediaType === 'audio' ? 'active' : ''}`}
              onClick={() => handleMediaTypeClick('audio')}
            >
              Audio
            </button>
          </div>
        )}
      </div>

      <div className="tab-content">
        {activeTab === 'stockMedia' && <StockMediaBox mediaType={mediaType} />}
        {activeTab === 'aiCommand' && <AICommandBox />}
      </div>
    </div>
  );
};

export default UserTab;
