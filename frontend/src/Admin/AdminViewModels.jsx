import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopBar from './AdminTopBar';
import AdminSidebar from './AdminSidebar';
import "./AdminViewModels.css";

export default function AdminViewModels() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list");
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        const response = await fetch('http://localhost:8000/api/models/');
        
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        
        const modelsData = await response.json();
        setModels(modelsData);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching models');
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  const goToModelDetails = (modelId) => {
    navigate(`/admin/model/${modelId}`);
  };

  const goToUpdateModel = () => {
    navigate(`/admin/update-model`);
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-top-row">
            <h1 className="admin-page-title">Models</h1>
            <div className="admin-view-controls">
              <button
                className={`admin-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                📋
              </button>
              <button
                className={`admin-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                📁
              </button>
            </div>
          </div>
          
          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}

          {isLoading ? (
            <div>Loading models...</div>
          ) : (
            <div className={`admin-model-list ${viewMode}`}>
              {models.map(modelItem => (
                <div
                  className="admin-model-item"
                  key={modelItem.model_id}
                  onClick={() => goToModelDetails(modelItem.model_id)}
                  tabIndex={0}
                  role="button"
                  onKeyPress={e => e.key === "Enter" && goToModelDetails(modelItem.model_id)}
                >
                  <div className="admin-model-info">
                    <span className="admin-model-name">
                      {modelItem.name} v{modelItem.version}
                    </span>
                    <div className="admin-model-updated">
                      <strong>Last Updated:</strong> {new Date(modelItem.upload_time).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="admin-model-arrow">▶</div>
                </div>
              ))}
            </div>
          )}
          <div className="adminViewModel-button-container">
            <button
              type="button"
              className="adminViewModel-btn-submit"
              onClick={goToUpdateModel}
            >
              Upload
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}