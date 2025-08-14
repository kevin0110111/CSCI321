// UserResultHistory.jsx
import './UserResult.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

// Get suggestions based on disease name
const getDiseaseSuggestions = (diseaseName, t) => {
  if (diseaseName && diseaseName !== "Healthy") {
    const key = diseaseName; // e.g. Blight
    return t(`diseaseSuggestions.${key}`, { returnObjects: true });
  }
  return diseaseName === "Healthy"
    ? t('diseaseSuggestions.Healthy', { returnObjects: true })
    : t('diseaseSuggestions.Default', { returnObjects: true });
};

export default function UserResult() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter condition states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [resultType, setResultType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state for displaying image details
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  
  // For recording selected result items
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Get account ID
  const accountId = localStorage.getItem("accountId");
  const BASE_API_URL = "https://fyp-backend-a0i8.onrender.com/api";
  
  // Initialize data loading
  useEffect(() => {
    if (accountId) {
      fetchResults();
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, [accountId]);
  
  // Update filtered results when filter conditions change
  useEffect(() => {
    filterResults();
  }, [results, startDate, endDate, resultType, searchTerm]);
  
  // Fetch result data
  const fetchResults = async () => {
    try {
      setLoading(true);
      console.log(`Fetching from: ${BASE_API_URL}/results/user/${accountId}`);
      
      const response = await fetch(`${BASE_API_URL}/results/user/${accountId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Results fetched successfully:", data.length);
      setResults(data);
      setFilteredResults(data);
    } catch (err) {
      console.error("Failed to fetch results:", err);
      setError(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter results
  const filterResults = () => {
    let filtered = [...results];
    
    // Filter by date
    if (startDate) {
      filtered = filtered.filter(result => {
        const resultDate = new Date(result.created_at).toISOString().split('T')[0];
        return resultDate >= startDate;
      });
    }
    
    if (endDate) {
      filtered = filtered.filter(result => {
        const resultDate = new Date(result.created_at).toISOString().split('T')[0];
        return resultDate <= endDate;
      });
    }
    
    // Filter by type
    if (resultType) {
      filtered = filtered.filter(result => result.result_type === resultType);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(result => 
        (result.note && result.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (result.result_data && result.result_data.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredResults(filtered);
  };
  
  // View details
  const handleViewResult = async (result) => {
    setSelectedResult(result);
    
    // Get image URL - using dedicated download URL endpoint
    try {
      const response = await fetch(`${BASE_API_URL}/images/${result.image_id}/download-url`);
      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.download_url); // Note: using download_url here
        setShowModal(true);
      } else {
        console.error("Failed to fetch image URL:");
      }
    } catch (err) {
      console.error("Fail to fetch image:", err);
    }
  };
  
  // Select row
  const handleSelectRow = (resultId) => {
    setSelectedRows(prev => {
      if (prev.includes(resultId)) {
        return prev.filter(id => id !== resultId);
      } else {
        return [...prev, resultId];
      }
    });
  };
  
  // Select all/none
  const handleSelectAll = () => {
    if (selectedRows.length === filteredResults.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredResults.map(result => result.result_id));
    }
  };
  
  if (loading) {
    return (
      <div className="user-result-loading">
        <div className="spinner"></div>
        <p>{t('loading') || 'Loading...'}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="user-result-error">
        <p>{t('error') || 'Error'}: {error}</p>
      </div>
    );
  }
  
  return (
    <main className="user-result-container">
      <h2>{t('resultHistory') || 'Detection Result History'}</h2>
      
      {/* Filter bar */}
      <div className="user-result-filters">
        <div className="user-result-filter-item">
          <label>{t('Date') || 'Date'}:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            className="user-result-date-input"
          />
        </div>
                
        <div className="user-result-filter-item">
          <label>{t('type') || 'Type'}:</label>
          <select 
            value={resultType} 
            onChange={e => setResultType(e.target.value)}
            className="user-result-select"
          >
            <option value="">{t('all') || 'All'}</option>
            <option value="count">{t('count') || 'Count'}</option>
            <option value="disease">{t('disease') || 'Disease'}</option>
          </select>
        </div>
        
        <div className="user-result-filter-item user-result-search">
          <input 
            type="text" 
            placeholder={t('searchResults') || 'Search Detection Result'} 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="user-result-search-input"
          />
        </div>
      </div>
      
      {/* Results table */}
      <div className="user-result-table-container">
        <table className="user-result-table">
          <thead>
            <tr>
              <th>{t('number') || 'NUMBER'}</th>
              <th>{t('type') || 'TYPE'}</th>
              <th>{t('result') || 'RESULT'}</th>
              <th>{t('note') || 'NOTE'}</th>
              <th>{t('date') || 'DATE'}</th>
              <th>{t(' ') || ''}</th> 
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((result, index) => {
                const date = new Date(result.created_at);
                const formattedDate = format(date, 'yyyy-MM-dd');
                
                return (
                  <tr key={result.result_id}>
                    <td>{index + 1}</td>
                    <td>{t(result.result_type) || result.result_type}</td>
                    <td>
                      {result.result_type === 'count'
                        ? result.result_data 
                        : t(`diseaseNames.${result.result_data}`) || result.result_data}
                    </td>
                    <td className="user-result-note">{result.note || '-'}</td>
                    <td>{formattedDate}</td>
                    <td>
                      <button 
                        className="user-result-view-btn"
                        onClick={() => handleViewResult(result)}
                      >
                        {isMobile ? t("view") : t("viewImage")}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="user-result-no-data">
                  {t('noResults') || 'No results found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Detail Modal */}
      {showModal && selectedResult && (
        <div className="user-result-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="user-result-modal-content" onClick={e => e.stopPropagation()}>
            <div className="user-result-modal-header">
              <h3>
                {selectedResult.result_type === 'count'
                  ? `${t('maizeCount') || 'Tassel Count'}: ${selectedResult.result_data}`
                  : `${t('diseaseDetection') || 'Disease Detection'}: ${t(`diseaseNames.${selectedResult.result_data}`) || selectedResult.result_data}`}
              </h3>
              <button className="user-result-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            
            <div className="user-result-modal-body">
              <div className="user-result-modal-image">
                {imageUrl ? (
                  <img src={imageUrl} alt="Result" />
                ) : (
                  <p>{t('imageNotAvailable') || 'Image not available'}</p>
                )}
              </div>
              
              <div className="user-result-modal-info">
                <p><strong>{t('id') || 'ID'}:</strong> {selectedResult.result_id}</p>
                <p><strong>{t('type') || 'Type'}:</strong> {t(selectedResult.result_type) || selectedResult.result_type}</p>
                <p><strong>{t('result') || 'Result'}:</strong> {
                  selectedResult.result_type === 'disease' 
                  ? t(`diseaseNames.${selectedResult.result_data}`) || selectedResult.result_data
                  : selectedResult.result_data
                }</p>
                <p><strong>{t('imageId') || 'Image ID'}:</strong> {selectedResult.image_id}</p>
                <p><strong>{t('date') || 'Date'}:</strong> {format(new Date(selectedResult.created_at), 'yyyy-MM-dd')}</p>
                <p><strong>{t('note') || 'Note'}:</strong> {selectedResult.note || '-'}</p>
              </div>
              
              {/* Add disease suggestions area - only shown for disease detection */}
              {selectedResult.result_type === 'disease' && (
                <div className="user-result-modal-suggestions">
                  <h4>{t('suggestions') || 'Suggestions'}</h4>
                  <ul className="user-result-suggestions-list">
                    {getDiseaseSuggestions(selectedResult.result_data, t).map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="user-result-modal-footer">
              <button 
                className="user-result-primary-btn"
                onClick={() => setShowModal(false)}
              >
                {t('close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}