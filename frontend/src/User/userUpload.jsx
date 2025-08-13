import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './userUpload.css';
import uploadIcon from '../assets/upload.png'; // Upload icon
import JSZip from 'jszip'; // For extracting zip files
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const BASE_API_URL = 'https://fyp-backend-a0i8.onrender.com/api';

export default function UserUpload() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMaizeConfirm, setShowMaizeConfirm] = useState(false);
  const [pendingCountFile, setPendingCountFile] = useState(null);
  const [showDiseaseTip, setShowDiseaseTip] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('uploadImage');
    const fetchSubscription = async () => {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) return;
      try {
        const resp = await fetch(
          `https://fyp-backend-a0i8.onrender.com/api/accounts/subscription-status?account_id=${accountId}`,{
          method: 'GET',
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          setIsPremium(data.is_premium);
        }
      } catch (e) {
        setIsPremium(false);
      }
    };
    fetchSubscription();
  }, [t]);

  // Handle file selection or zip extraction
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (!isPremium) {
      if (selectedFiles.length > 1) {
        alert(t('freeUserMultiUploadAlert'));
        return;
      }
      if (selectedFiles.some(f => f.name.endsWith('.zip'))) {
        alert(t('zipUploadPremiumAlert')); // Use translation
        return;
      }
    }

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
              const fileObj = new File([blob], filename, { type: blob.type || 'image/jpeg' });
              const previewUrl = URL.createObjectURL(fileObj);
              newPreviewFiles.push({
                file: fileObj,
                name: filename,
                type: fileObj.type,
                previewUrl,
            });
          }
        }
      }
      // Handle single image files
      else if (file.type.startsWith('image/')) {
        newPreviewFiles.push({
          file,
          name: file.name,
          type: file.type,
          previewUrl: URL.createObjectURL(file),
        });
      }
    }


    if (!isPremium) {
      setFiles(newPreviewFiles.slice(0, 1));
    } else {
      setFiles((prev) => [...prev, ...newPreviewFiles]);
    }
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
    fileInputRef.current.value = null;
  };

  // Count按钮逻辑
  const handleCount = async () => {
    if (files.length === 0) {
      alert(t('uploadImageFirstAlert'));
      return;
    }
    setLoading(true);
    setResults([]); // 清空旧结果
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file.file || file);
        formData.append('task', 'detect');
        const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData);
        if (resp.data.result !== 'maize') {
          // 非maize，弹窗询问
          setPendingCountFile(file);
          setShowMaizeConfirm(true);
          setLoading(false);
          return; // 遇到非maize就停止，等用户确认
        }
        await doCount(file, file.previewUrl);
      } catch (e) {
        setResults(prev => [...prev, { error: t('detectionFailed'), previewUrl: file.previewUrl }]);
      }
    }
    setLoading(false);
  };

  // 用户确认后再count
  const handleMaizeConfirm = async (goOn) => {
    setShowMaizeConfirm(false);
    if (goOn && pendingCountFile) {
      setLoading(true);
      await doCount(pendingCountFile);
      setLoading(false);
    }
    setPendingCountFile(null);
  };

  // 实际count模型调用
  const doCount = async (file, previewUrl) => {
    try {
      const formData = new FormData();
      formData.append('file', file.file || file);
      formData.append('task', 'count');
      const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData);
      setResults(prev => [...prev, { ...resp.data, previewUrl }]);
    } catch (e) {
      setResults(prev => [...prev, { error: t('countFailed'), previewUrl }]);
    }
  };

  // Disease按钮逻辑
  const handleDisease = () => {
    if (files.length === 0) {
      alert(t('uploadImageFirstAlert'));
      return;
    }
    setShowDiseaseTip(true);
  };

  const doDisease = async () => {
    setShowDiseaseTip(false);
    setLoading(true);
    setResults([]); // 清空旧结果
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file.file || file);
        formData.append('task', 'disease');
        const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData);
        setResults(prev => [...prev, { ...resp.data, previewUrl: file.previewUrl }]);
      } catch (e) {
        setResults(prev => [...prev, { error: t('diseaseDetectionFailed'), previewUrl: file.previewUrl }]);
      }
    }
    setLoading(false);
  };

  const handleSaveImage = (base64Data) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64Data}`;
    link.download = `maize_count_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteResult = (indexToRemove) => {
    setResults(results.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <main className="dashboard-content">
      <div className="upload-container">
        <h2>{t('uploadMaizeImages')}</h2>

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
                      {t('remove')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <img src={uploadIcon} alt="Upload" />
              <p>
                Drag and drop your image{isPremium ? '(s)/ZIP' : ''} or{' '}
                <span className="browse" onClick={triggerFileSelect}>{t('browse')}</span>
              </p>
              <p>
                Support {isPremium ? 'ZIP, ' : ''}png, jpg, jpeg
              </p>
            </>
          )}
          <input
            type="file"
            accept={isPremium ? ".zip,image/*" : "image/*"}
            multiple={isPremium}
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* Show image count if uploaded */}
        <div className="upload-info">
          {files.length > 0 && (
            <div className="image-type">
              {t('imageCount')}: <span className="radio-selected">{files.length}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="button-group">
          <button className="reset-btn" onClick={handleReset}>{t('reset')}</button>
          <button className="submit-btn" onClick={handleCount} disabled={loading}>
            {loading ? t('counting') : t('count')}
          </button>
          <button className="premium-btn" disabled={!isPremium || loading} onClick={handleDisease}>
            {loading ? t('checking') : t('checkDisease')}
          </button>
        </div>
        {!isPremium && (
          <div style={{ color: '#e53935', marginTop: 8, fontSize: 14 }}>
            {t('premiumFeatureAlert')}
          </div>
        )}
      </div>

      {/* maize确认弹窗 */}
      {showMaizeConfirm && (
        <div className="modal">
          <div className="modal-content">
            <p>{t('notMaizeConfirm')}</p>
            <button onClick={() => handleMaizeConfirm(true)}>{t('continueDetection')}</button>
            <button onClick={() => handleMaizeConfirm(false)}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* disease提示弹窗 */}
      {showDiseaseTip && (
        <div className="modal">
          <div className="modal-content">
            <p>{t('singleLeafTip')}</p>
            <button onClick={doDisease}>{t('continueDetectionAcknowledge')}</button>
          </div>
        </div>
      )}

      {/* 优化后的结果展示区域 */}
      {results.length > 0 && (
        <div className="result-area">
          <h3>{t('results')}</h3>
          {results.map((res, idx) => (
            <div key={idx} className="result-item">
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <img src={res.previewUrl} alt="Uploaded" style={{maxWidth: 120, borderRadius: 8}} />
                {res.image_base64 ? (
                  <img src={`data:image/jpeg;base64,${res.image_base64}`} alt="Result" style={{maxWidth: 200, borderRadius: 8}} />
                ) : null}
                <div>
                  {res.result && <div><b>{t('result')}:</b> {res.result}</div>}
                  {res.error && <div style={{color: 'red'}}>{res.error}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}