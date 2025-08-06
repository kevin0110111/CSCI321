import React, { useState } from 'react';
import AdminTopBar from './AdminTopBar';
import AdminSidebar from './AdminSidebar';
import './AdminUpdateModel.css';

export default function AdminUpdateModel() {
  const [modelName, setModelName] = useState('');
  const [version, setVersion] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseBox, setResponseBox] = useState({ show: false, message: '', onOk: null });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleCreateNew = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setResponseBox({ show: true, message: 'Please select a file to upload', onOk: null });
      return;
    }

    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      setResponseBox({ show: true, message: 'User not authenticated. Please log in again.', onOk: null });
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', modelName);
      formData.append('version', version);
      formData.append('uploaded_by', accountId);
      if (note) formData.append('note', note);
      formData.append('file', file);

      const response = await fetch(`http://localhost:8000/api/models/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setResponseBox({ 
          show: true, 
          message: 'Model created successfully!', 
          onOk: () => {
            // Reset form
            setModelName('');
            setVersion('');
            setNote('');
            setFile(null);
          }
        });
      } else {
        const errorData = await response.json();
        setResponseBox({ 
          show: true, 
          message: `Error: ${errorData.detail || 'Failed to create model'}`, 
          onOk: null 
        });
      }
    } catch (error) {
      console.error('Error creating model:', error);
      setResponseBox({ 
        show: true, 
        message: 'Network error. Please try again.', 
        onOk: null 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-update-model-dashboard">
      <AdminTopBar />
      <div className="admin-update-model-layout">
        <AdminSidebar />
        <main className="admin-update-model-container">
          <h2 className="admin-update-model-section-title">Create New Model</h2>
          <hr className="admin-update-model-divider" />
          
          <form className="admin-update-model-form" onSubmit={handleCreateNew}>
            <label>
              Name
              <input 
                type="text" 
                placeholder="e.g. Model Name" 
                required 
                className="admin-update-model-form-select" 
                value={modelName} 
                onChange={e => setModelName(e.target.value)} 
              />
            </label>
            
            <label>
              Version
              <input 
                type="text" 
                placeholder="e.g. 1.2.3" 
                required 
                className="admin-update-model-form-select" 
                value={version} 
                onChange={e => setVersion(e.target.value)} 
              />
            </label>
            
            <label>
              Note
              <textarea 
                placeholder="e.g. A brief description of the new model." 
                className="admin-update-model-form-select" 
                value={note} 
                onChange={e => setNote(e.target.value)} 
                rows="4" 
              />
            </label>
            
            <hr className="admin-update-model-divider" />
            
            <div 
              className="admin-update-model-file-upload-box" 
              onDragOver={handleDragOver} 
              onDrop={handleDrop}
            >
              {file ? (
                <div className="file-selected-message">
                  <p>Selected file: {file.name}</p>
                  <button 
                    type="button" 
                    onClick={() => setFile(null)}
                    className="change-file-button"
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <>
                  <p>Drag and drop a file here, or click to browse.</p>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    required 
                    className="modelfile-input"
                  />
                </>
              )}
            </div>
            
            <hr className="admin-update-model-divider" />
            
            <button 
              type="submit" 
              className="admin-update-model-save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Create New Model'}
            </button>
          </form>
        </main>
      </div>

      {responseBox.show && (
        <div className="admin-Update-modal-overlay">
          <div className="admin-Update-modal-box">
            <p>{responseBox.message}</p>
            <button 
              className="admin-Update-btn admin-Update-btn-ok" 
              onClick={() => {
                if (responseBox.onOk) responseBox.onOk();
                setResponseBox({ show: false, message: '', onOk: null });
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}