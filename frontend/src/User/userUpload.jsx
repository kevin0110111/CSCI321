import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './UserUpload.css';
import uploadIcon from '../assets/upload.svg';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';

export default function UserUpload() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const previewFiles = selectedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles(previewFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const previewFiles = droppedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles(previewFiles);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleReset = () => {
    setFiles([]);
    fileInputRef.current.value = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemove = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
  };

  return (
    <div className="user-dashboard">
      {/* 顶部栏 */}
      <div className="dashboard-header">
        <div className="menu-icon" onClick={toggleSidebar}>
          &#9776;
        </div>

        <div className="product-logo">
          <img src={logo} alt="Product Logo" className="logo-img" />
          <span className="product-name">MaizeTassel AI</span>
        </div>

        <div className="avatar-box">
          <img src={avatar} alt="User Avatar" className="avatar-img" />
        </div>
      </div>

      {/* 主体区域 */}
      <div className="dashboard-body">
        <div className={`usersidebar ${sidebarOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/userDashboard">Dashboard</Link></li>
            <li><Link to="/userupload">Upload image</Link></li>
            <li><Link to="/user/history">View result history</Link></li>
            <li><Link to="/login">Log out</Link></li>
          </ul>
        </div>

        <main className="dashboard-content">
          <div className="upload-container">
            <h2>Upload Crop Image</h2>

            <div
              className={`upload-box ${dragActive ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {files.length > 0 ? (
                <div className="preview-gallery">
                  {files.map((file, index) => (
                    <div className="preview-wrapper" key={index}>
                      <img src={file.previewUrl} alt="Preview" className="preview-image" />
                      <div className="preview-filename" title={file.name}>{file.name}</div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <img src={uploadIcon} alt="Upload" />
                  <p>
                    Drag and drop your image(s) or <span className="browse" onClick={triggerFileSelect}>Browse</span>
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <div className="upload-info">
              {files.length > 0 && (
                <div className="image-type">
                  Image count: <span className="radio-selected">{files.length}</span>
                </div>
              )}
            </div>

            <div className="button-group">
              <button className="reset-btn" onClick={handleReset}>Reset</button>
              <button className="submit-btn" disabled={files.length === 0}>Submit</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
