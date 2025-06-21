import { useRef, useState, useEffect } from 'react';
import './UserUpload.css';
import uploadIcon from '../assets/upload.svg';
import { useNavigate } from 'react-router-dom';

export default function UserUpload() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();


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

  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState(null); // 模拟结果
  const [showDiseaseInfo, setShowDiseaseInfo] = useState(false);

  
  useEffect(() => {
        document.title = 'Upload';
      }, []);

  return (
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

          <button
            className="submit-btn"
            disabled={files.length === 0}
            onClick={() => {
              setCurrentResult({
                count: Math.floor(Math.random() * 50),
                image: files[0].previewUrl,
              });
              setShowResult(true);
            }}
          >
            Count
          </button>

          <button
            className="premium-btn"
            disabled={false}
            title="Premium only"
            onClick={() => {
              setCurrentResult({
                image: files[0].previewUrl,
                disease: 'Rust',
              });
              setShowDiseaseInfo(true);
            }}
          >
            Check Disease (Premium)
          </button>

        </div>

          </div>
      {showResult && currentResult && (
        <div className="result-modal-overlay">
          <div className="result-modal-content">
            <h3>Analysis Result</h3>
            <img src={currentResult.image} alt="Result" className="modal-image" />
            <p><strong>Tassel Count:</strong> {currentResult.count}</p>

            <div className="modal-button-group">
              <button className="count-btn-save" onClick={() => setShowResult(false)}>
                Save
              </button>
              <button
                className="count-btn-reannotate"
                onClick={() => {
                  setShowResult(false);
                  navigate('/user/reannotate', {
                    state: { image: currentResult.image }
                  });
                }}
              >
                Re-annotate
              </button>
              <button className="count-btn-cancel" onClick={() => setShowResult(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {showDiseaseInfo && currentResult && (
        <div className="disease-modal-overlay">
          <div className="disease-modal-content">
            <h3>Disease Detection Result</h3>
            <img src={currentResult.image} alt="Result" className="modal-image" />
            <p><strong>Detected Disease:</strong> {currentResult.disease}</p>
            <p>
              <strong>Description:</strong> This disease typically appears as reddish-brown lesions on the leaf surface and can spread under humid conditions.
            </p>
            <div className="modal-button-group">
              <button className="disease-btn-save" onClick={() => setShowDiseaseInfo(false)}>
                Save
              </button>
              <button
                className="disease-btn-generate"
                onClick={() => {
                  setShowDiseaseInfo(false);
                  navigate('/user/densitymap');
                }}
              >
                Generate Density Map
              </button>
              <button
                className="disease-btn-cancel"
                onClick={() => setShowDiseaseInfo(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



        </main>
  );
}
