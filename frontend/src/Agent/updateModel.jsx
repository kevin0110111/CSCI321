import './updateModel.css';
import model from '../assets/model.svg';
import comment from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import upload from '../assets/upload.svg';
import profile from '../assets/profile.svg';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function UpdateModel() {
  const navigate = useNavigate();
  const [modelName, setModelName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleModelNameChange = (e) => {
    setModelName(e.target.value);
  };

  const handleProfileClick = () => {
    navigate('/updateAgentAccount');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar remains the same */}
      <aside className="sidebar">
        <div className="logo">Agent Portal</div>
        <nav className="sidebar-nav">
          <div>
            <Link to="/agentModel" className="nav-link active">
              <img src={model} alt="Model" className="icon"/> Model
            </Link>
            <Link to="/agentComment" className="nav-link">
              <img src={comment} alt="Comment" className="icon"/> Comment
            </Link>
            <Link to="/agentBugReport" className="nav-link">
              <img src={reportBug} alt="ReportedBug" className="icon"/> Reported Bug
            </Link>
            <Link to="/agentFAQ" className="nav-link">
              <img src={faq} alt="FAQ" className="icon"/> FAQ
            </Link>
          </div>
          <div className="logout-container">
            <a href="#" className="nav-link">
              <img src={logout} alt="Logout" className="icon"/> Logout
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-section">
        {/* Header */}
        <header className="header">
          <h1>Update Model</h1>
          <div className="profile">
            <button onClick={handleProfileClick} className="profile-button">
              <img src={profile} alt="Profile" className="profile-icon" />
            </button>  
          </div>
        </header>

        {/* Update Model Form */}
        <main className="update-model-container">
          <div className="model-name-section">
            <h2>Model name</h2>
            <input
              type="text"
              value={modelName}
              onChange={handleModelNameChange}
              placeholder="Enter model name"
              className="model-name-input"
            />
          </div>

          <div className="upload-section">
            <h2>Model upload</h2>
            <div 
              className="file-upload-box"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <img src={upload} alt="Upload" className="upload-icon"/>
              <p>Drag and drop here or Browse files</p>
              <input 
                type="file" 
                id="file-upload" 
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                multiple
              />
              <label htmlFor="file-upload" className="browse-button">
                Browse files
              </label>
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <p>Selected files: {selectedFiles.length}</p>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button className="update-button">Update</button>
            <button className="back-button">Back</button>
          </div>
        </main>
      </div>
    </div>
  );
}