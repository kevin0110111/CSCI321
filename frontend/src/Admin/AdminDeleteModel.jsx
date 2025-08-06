import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminDeleteModel.css";

export default function AdminDeleteModel() {
  const navigate = useNavigate();
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [responseBox, setResponseBox] = useState({ show: false, message: '', onOk: null });
  const [confirmBox, setConfirmBox] = useState({ show: false, message: '', onConfirm: null });

  // Update form states
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [modelName, setModelName] = useState('');
  const [version, setVersion] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateMessageType, setUpdateMessageType] = useState('');

  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8000/api/models/${modelId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Model not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const modelData = await response.json();
        setModel(modelData);
      } catch (err) {
        console.error('Error fetching model details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (modelId) {
      fetchModelDetails();
    }
  }, [modelId]);

  const showUpdateMessage = (text, type) => {
    setUpdateMessage(text);
    setUpdateMessageType(type);
    setTimeout(() => {
      setUpdateMessage('');
      setUpdateMessageType('');
    }, 5000);
  };

  const handleUpdateClick = () => {
    setModelName(model.name);
    setVersion(model.version);
    setNote(model.note || '');
    setFile(null);
    setShowUpdateForm(true);
  };

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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', modelName);
      formData.append('version', version);
      if (note) formData.append('note', note);
      if (file) formData.append('file', file);

      const response = await fetch(`http://localhost:8000/api/models/${modelId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedModel = await response.json();
        setModel(updatedModel);
        showUpdateMessage('Model updated successfully!', 'success');
        
        // Reset form and close update form
        setModelName('');
        setVersion('');
        setNote('');
        setFile(null);
        setShowUpdateForm(false);
      } else {
        const errorData = await response.json();
        showUpdateMessage(`Error: ${errorData.detail || 'Failed to update model'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating model:', error);
      showUpdateMessage('Network error. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelUpdate = () => {
    setModelName('');
    setVersion('');
    setNote('');
    setFile(null);
    setShowUpdateForm(false);
  };

  const handleDeleteClick = () => {
    setConfirmBox({
      show: true,
      message: `Are you sure you want to delete "${model.name}" (v${model.version})? This action cannot be undone.`,
      onConfirm: handleDeleteConfirmed
    });
  };

  const handleDeleteConfirmed = async () => {
    setConfirmBox({ show: false, message: '', onConfirm: null });
    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8000/api/models/${modelId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete model');
      }

      setResponseBox({
        show: true,
        message: `Model "${model.name}" (v${model.version}) has been deleted successfully.`,
        onOk: () => navigate('/admin/view-models')
      });
    } catch (err) {
      console.error('Error deleting model:', err);
      setResponseBox({
        show: true,
        message: `Error: ${err.message}`,
        onOk: null
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackClick = () => {
    navigate('/admin/view-models');
  };

  if (loading && !model) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="adminDelMod-content">
            <div>Loading model details...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="adminDelMod-content">
            <h2>Model not found</h2>
            {error && (
              <div className="adminDelMod-error-message">
                {error}
              </div>
            )}
            <div className="adminDelMod-buttons-container">
              <button 
                className="adminDelMod-btn adminDelMod-btn-back" 
                onClick={handleBackClick}
              >
                Back to Models
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="adminDelMod-content">
          <h2 className="adminDelMod-model-details-header">Model Details</h2>

          {error && (
            <div className="adminDelMod-error-message">
              {error}
            </div>
          )}

          {/* Update Message Display */}
          {updateMessage && (
            <div className={`adminDelMod-message ${updateMessageType === 'success' ? 'success' : 'error'}`}
                 style={{
                   padding: '10px',
                   marginBottom: '15px',
                   borderRadius: '5px',
                   backgroundColor: updateMessageType === 'success' ? '#d4edda' : '#f8d7da',
                   color: updateMessageType === 'success' ? '#155724' : '#721c24',
                   border: updateMessageType === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                 }}>
              {updateMessage}
            </div>
          )}

          <section className="adminDelMod-model-info-section">
            <p><strong>Name:</strong> {model.name}</p>
            <p><strong>Version:</strong> {model.version}</p>
            <p><strong>Upload Date:</strong> {new Date(model.upload_time).toLocaleDateString()}</p>
            {model.note && <p><strong>Note:</strong> {model.note}</p>}
            {model.file_path && <p><strong>File:</strong> {model.file_path}</p>}
          </section>

          {/* Update Form */}
          {showUpdateForm && (
            <div className="adminDelMod-update-section" style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3>Update Model</h3>
              <form onSubmit={handleUpdateSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Model Name" 
                    required 
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    value={modelName} 
                    onChange={e => setModelName(e.target.value)} 
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Version
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1.2.3" 
                    required 
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    value={version} 
                    onChange={e => setVersion(e.target.value)} 
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Note
                  </label>
                  <textarea 
                    placeholder="e.g. A brief description of the update." 
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '80px'
                    }}
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                    rows="4" 
                  />
                </div>
                
                <div 
                  style={{
                    border: '2px dashed #ddd',
                    borderRadius: '6px',
                    padding: '20px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    backgroundColor: '#fafafa'
                  }}
                  onDragOver={handleDragOver} 
                  onDrop={handleDrop}
                >
                  <p>Drag and drop a file here, or click to browse.</p>
                  <input type="file" onChange={handleFileChange} style={{ marginTop: '10px' }} />
                  {file && <p style={{ marginTop: '10px', color: '#28a745' }}>Selected file: {file.name}</p>}
                  {!file && (
                    <p style={{ marginTop: '10px', color: '#6c757d' }}>Current file: {model.file_path}</p>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button"
                    onClick={cancelUpdate}
                    disabled={submitting}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: submitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#1e6601',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: submitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {submitting ? 'Updating...' : 'Update Model'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="adminDelMod-buttons-container">
            <button 
              className="adminDelMod-btn adminDelMod-btn-back" 
              onClick={handleBackClick}
              disabled={submitting}
            >
              Back to Models
            </button>
            <div className="adminDelMod-action-buttons">
              <button 
                className="adminDelMod-btn adminDelMod-btn-update"
                onClick={handleUpdateClick}
                disabled={loading || submitting || showUpdateForm}
              >
                {showUpdateForm ? 'Updating...' : 'Update Model'}
              </button>
              <button 
                className="adminDelMod-btn adminDelMod-btn-danger" 
                onClick={handleDeleteClick} 
                disabled={loading || submitting || showUpdateForm}
              >
                {submitting ? 'Deleting...' : 'Delete Model'}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Dialog */}
      {confirmBox.show && (
        <div className="adminDelMod-modal-overlay">
          <div className="adminDelMod-modal-box">
            <p>{confirmBox.message}</p>
            <div className="adminDelMod-modal-buttons">
              <button 
                className="adminDelMod-btn adminDelMod-btn-back" 
                onClick={() => setConfirmBox({ show: false, message: '', onConfirm: null })}
              >
                Cancel
              </button>
              <button 
                className="adminDelMod-btn adminDelMod-btn-danger" 
                onClick={() => {
                  if (confirmBox.onConfirm) confirmBox.onConfirm();
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Dialog */}
      {responseBox.show && (
        <div className="adminDelMod-modal-overlay">
          <div className="adminDelMod-modal-box">
            <p>{responseBox.message}</p>
            <button 
              className="adminDelMod-btn adminDelMod-btn-back" 
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