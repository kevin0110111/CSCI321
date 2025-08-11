import { useRef, useState, useEffect } from 'react';
import './userUpload.css';
import uploadIcon from '../assets/upload.png'; // Upload icon
import JSZip from 'jszip'; // For extracting zip files
import { useNavigate } from 'react-router-dom';

export default function UserUpload() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  // Handle file selection or zip extraction
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newPreviewFiles = [];

    for (const file of selectedFiles) {
      // Handle zip files
      if (file.name.endsWith('.zip')) {
        const zip = new JSZip();
        const content = await zip.loadAsync(file);

        for (const filename of Object.keys(content.files)) {
          const zipEntry = content.files[filename];
          // Only extract images (skip folders or unsupported files)
          if (!zipEntry.dir && /\.(png|jpe?g|gif)$/i.test(filename)) {
            const blob = await zipEntry.async('blob');
            const previewUrl = URL.createObjectURL(blob);
            newPreviewFiles.push({
              name: filename,
              type: blob.type,
              previewUrl,
            });
          }
        }
      }
      // Handle single image files
      else if (file.type.startsWith('image/')) {
        newPreviewFiles.push({
          name: file.name,
          type: file.type,
          previewUrl: URL.createObjectURL(file),
        });
      }
    }

    setFiles((prev) => [...prev, ...newPreviewFiles]);
  };

  // Drag & drop support
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const eventLike = { target: { files: droppedFiles } };
    await handleFileChange(eventLike);
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

  useEffect(() => {
    document.title = 'Upload';
  }, []);

  return (
    <main className="dashboard-content">
      <div className="upload-container">
        <h2>Upload Maize Images</h2>

        {/* Upload box with drag/drop and preview area */}
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
                  <div className="preview-meta">
                    <div className="preview-filename" title={file.name}>{file.name}</div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <img src={uploadIcon} alt="Upload" />
              <p>
                Drag and drop your image(s) or{' '}
                <span className="browse" onClick={triggerFileSelect}>Browse</span>
              </p>
              <p>Support ZIP, png, jpg, jpeg</p>

            </>
          )}
          <input
            type="file"
            accept=".zip,image/*"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* Show image count if uploaded */}
        <div className="upload-info">
          {files.length > 0 && (
            <div className="image-type">
              Image count: <span className="radio-selected">{files.length}</span>
            </div>
          )}
        </div>

        {/* Action buttons (logic simplified) */}
        <div className="button-group">
          <button className="reset-btn" onClick={handleReset}>Reset</button>

          <button
            className="submit-btn"
            onClick={() => {
              if (files.length === 0) {
                alert('Please upload at least one image before counting.');
                return;
              }
              alert('Count requested.');
            }}
          >
            Count
          </button>

          <button
            className="premium-btn"
            onClick={() => {
              if (files.length === 0) {
                alert('Please upload at least one image before checking for disease.');
                return;
              }
              alert('Disease check requested.');
            }}
          >
            Check Disease (Premium)
          </button>
        </div>
      </div>
    </main>
  );
}