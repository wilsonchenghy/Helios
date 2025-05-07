import { useState } from 'react';
import AICommandBox from './AICommandBox';
import StockMediaBox from './StockMediaBox';
import '../styles/UserTab.css';

const UserTab = () => {
  const [activeTab, setActiveTab] = useState('stockMedia'); // Default to Stock Media

  const handleSelectChange = (e) => {
    setActiveTab(e.target.value);
  };

  return (
    <div className="user-tab-container">
      <div className="tab-selector">
        <label htmlFor="tab-dropdown" className="tab-label">Select View:</label>
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

      <div className="tab-content">
        {activeTab === 'stockMedia' && <StockMediaBox />}
        {activeTab === 'aiCommand' && <AICommandBox />}
      </div>
    </div>
  );
};

export default UserTab;
