import { useRef, useState, useEffect } from "react"
import axios from "axios"
import "./userUpload.css"
import uploadIcon from '../assets/upload.png';
import JSZip from "jszip" // For extracting zip files
import { useNavigate } from "react-router-dom"
import { useTranslation, Trans } from "react-i18next"
const BASE_API_URL = "https://fyp-backend-a0i8.onrender.com/api"

export default function UserUpload() {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [isPremium, setIsPremium] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMaizeConfirm, setShowMaizeConfirm] = useState(false)
  const [pendingCountFile, setPendingCountFile] = useState(null)
  const [showDiseaseTip, setShowDiseaseTip] = useState(false)
  const navigate = useNavigate()
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState(null)
  const [pendingTasks, setPendingTasks] = useState([]);
  const { t } = useTranslation()
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [savingResultIndex, setSavingResultIndex] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [isDiseaseLoading, setIsDiseaseLoading] = useState(false);

  useEffect(() => {
    document.title = t("uploadImage")
    const fetchSubscription = async () => {
      const accountId = localStorage.getItem("accountId")
      if (!accountId) return
      try {
        const resp = await fetch(
          `https://fyp-backend-a0i8.onrender.com/api/accounts/subscription-status?account_id=${accountId}`,
          {
            method: "GET",
          },
        )
        if (resp.ok) {
          const data = await resp.json()
          setIsPremium(data.is_premium)
        }
      } catch (e) {
        setIsPremium(false)
      }
    }
    fetchSubscription()
  }, [t])

  // Handle file selection or zip extraction
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files)

    if (!isPremium) {
      if (selectedFiles.length > 1) {
        alert(t("freeUserMultiUploadAlert"))
        return
      }
      if (selectedFiles.some((f) => f.name.endsWith(".zip"))) {
        alert(t("zipUploadPremiumAlert")) // Use translation
        return
      }
    }

    const newPreviewFiles = []

    for (const file of selectedFiles) {
      // Handle zip files
      if (file.name.endsWith(".zip")) {
        const zip = new JSZip()
        const content = await zip.loadAsync(file)

        for (const filename of Object.keys(content.files)) {
          const zipEntry = content.files[filename]
          // Only extract images (skip folders or unsupported files)
          if (!zipEntry.dir && /\.(png|jpe?g|gif)$/i.test(filename)) {
            const blob = await zipEntry.async("blob")
            const fileObj = new File([blob], filename, { type: blob.type || "image/jpeg" })
            const previewUrl = URL.createObjectURL(fileObj)
            newPreviewFiles.push({
              file: fileObj,
              name: filename,
              type: fileObj.type,
              previewUrl,
            })
          }
        }
      }
      // Handle single image files
      else if (file.type.startsWith("image/")) {
        newPreviewFiles.push({
          file,
          name: file.name,
          type: file.type,
          previewUrl: URL.createObjectURL(file),
        })
      }
    }

    if (!isPremium) {
      setFiles(newPreviewFiles.slice(0, 1))
    } else {
      setFiles((prev) => [...prev, ...newPreviewFiles])
    }
  }

  const handleImageError = (event, index) => {
    console.log("Image preview failed to load, refreshing...");
    const file = files[index];
    if (file && file.file) {
      
      if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      
      const newUrl = URL.createObjectURL(file.file);
      
      const updatedFiles = [...files];
      updatedFiles[index] = {...file, previewUrl: newUrl};
      setFiles(updatedFiles);
    }
  };

  // Drag & drop support
  const handleDrop = async (e) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    const eventLike = { target: { files: droppedFiles } }
    await handleFileChange(eventLike)
  }

  const triggerFileSelect = () => {
    fileInputRef.current.click()
  }

  const handleReset = () => {
    // reelease all preview URLs
    files.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    setFiles([]);
    setResults([]);
    fileInputRef.current.value = null;
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleRemove = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);

    if (files[indexToRemove] && files[indexToRemove].previewUrl) {
      URL.revokeObjectURL(files[indexToRemove].previewUrl);
    }
    setFiles(updatedFiles);
    fileInputRef.current.value = null;
  }

  // Count button logic
  const handleCount = async () => {
    if (files.length === 0) {
      alert(t("uploadImageFirstAlert") || "Please upload an image first")
      return
    }
    setIsCountLoading(true)  
    setResults([]) // Clear old results

    const newPendingTasks = []

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append("file", file.file || file)
        formData.append("task", "detect")
        const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData)
        if (resp.data.result !== "maize") {
          // not maize store first
          newPendingTasks.push(file)
          continue // skip
        }
        await doCount(file, file.previewUrl)
      } catch (e) {
        setResults((prev) => [
          ...prev,
          { error: t("detectionFailed") || "Detection failed", previewUrl: file.previewUrl },
        ])
      }
    }
    if (newPendingTasks.length > 0) {
      setPendingCountFile(newPendingTasks[0]);
      setPendingTasks(newPendingTasks.slice(1));
      setShowMaizeConfirm(true);
    } else {
      setIsCountLoading(false);  // 使用Count特定的加载状态
    }
  };


  // Count after user confirmation
  const handleMaizeConfirm = async (goOn) => {
    setShowMaizeConfirm(false);

    if (goOn && pendingCountFile) {
      try {
        setLoading(true);
        await doCount(pendingCountFile, pendingCountFile.previewUrl);
      } catch (e) {
        setResults((prev) => [
          ...prev,
          { error: t("countFailed") || "Count failed", previewUrl: pendingCountFile.previewUrl },
        ]);
      }
    }

    if (pendingTasks.length > 0) {
      const next = pendingTasks[0];
      setPendingCountFile(next);
      setPendingTasks(pendingTasks.slice(1));
      setShowMaizeConfirm(true);
    } else {
      setPendingCountFile(null);
      setLoading(false);
    }
  };

  // Actual count model call
  const doCount = async (file, previewUrl) => {
    try {
      const formData = new FormData()
      formData.append("file", file.file || file)
      formData.append("task", "count")
      const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData)
      setResults((prev) => [...prev, { ...resp.data, previewUrl, taskType: "count" }])
    } catch (e) {
      setResults((prev) => [...prev, { error: t("countFailed") || "Count failed", previewUrl }])
    }
  }


  // Disease button logic
  const handleDisease = () => {
    if (files.length === 0) {
      alert(t("uploadImageFirstAlert") || "Please upload an image first")
      return
    }
    setShowDiseaseTip(true)
  }

  const doDisease = async () => {
    setShowDiseaseTip(false)
    setIsDiseaseLoading(true)  
    setResults([]) // Clear old results
    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append("file", file.file || file)
        formData.append("task", "disease")
        const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData)
        setResults((prev) => [...prev, { ...resp.data, previewUrl: file.previewUrl, taskType: "disease" }])
      } catch (e) {
        setResults((prev) => [
          ...prev,
          { error: t("diseaseDetectionFailed") || "Disease detection failed", previewUrl: file.previewUrl },
        ])
      }
    }
    setIsDiseaseLoading(false)  
  }

  const handleSaveResult = (resultIndex) => {
    
    setSavingResultIndex(resultIndex);
    setCurrentNote(''); 
    setShowNoteModal(true);
  };

  const saveResultWithNote = async () => {
    
    setShowNoteModal(false);
    
    
    const resultIndex = savingResultIndex;
    const result = results[resultIndex];
    
    
    const saveBtn = document.querySelector(`[data-idx="${resultIndex}"].user-upload-save-btn`);
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = t("saving") || "Saving...";
    
    try {
      const accountId = localStorage.getItem("accountId");
      
      if (!accountId) {
        alert(t("loginRequired") || "Please login to save results");
        return;
      }
      
      let imageFile, formData = new FormData();
      
      
      if (result.taskType === "count" && result.image_base64) {
        
        const base64Data = result.image_base64;
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        
        for (let i = 0; i < byteCharacters.length; i += 512) {
          const slice = byteCharacters.slice(i, i + 512);
          const byteNumbers = new Array(slice.length);
          for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        
        const blob = new Blob(byteArrays, { type: "image/jpeg" });
        const fileName = `maize_count_result_${Date.now()}.jpg`;
        imageFile = new File([blob], fileName, { type: "image/jpeg" });
        
      } else if (result.taskType === "disease") {
        
        try {
          const response = await fetch(result.previewUrl);
          const blob = await response.blob();
          const fileName = `maize_disease_original_${Date.now()}.jpg`;
          imageFile = new File([blob], fileName, { type: blob.type });
        } catch (error) {
          console.error("Error fetching image from URL:", error);
          throw new Error("Failed to prepare image for upload");
        }
      } else {
        alert(t("noImageToSave") || "No image data to save.");
        return;
      }
      
      
      formData.append("user_id", accountId);
      formData.append("file", imageFile);
      formData.append("result_type", result.taskType);
      if (result.result) {
        formData.append("result_value", result.result.toString());
      }
      
      
      const response = await fetch(`${BASE_API_URL}/images/`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      
      
      const resultData = {
        user_id: parseInt(accountId),
        image_id: data.image_id,
        result_type: result.taskType,
        result_data: result.result ? result.result.toString() : "",
        is_saved: true,
        note: currentNote 
      };
      
      
      const resultResponse = await fetch(`${BASE_API_URL}/results/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultData),
      });
      
      if (!resultResponse.ok) {
        console.warn("Failed to save result to database:");
        throw new Error("Failed to save result to database");
      }
      
      
      setSuccessMessage(t("imageSavedSuccess") || "Image saved successfully!");
      setShowSuccessModal(true);
      
      
      result.savedToDatabase = true;
      result.savedImageId = data.image_id;
      
      
      const updatedResults = [...results];
      updatedResults[resultIndex] = { ...result };
      setResults(updatedResults);
      
    } catch (error) {
      console.error("Error saving image:", error);
      setSuccessMessage(t("saveImageError") || "Error saving image. Please try again.");
      setShowSuccessModal(true); 
    } finally {
      
      const saveBtn = document.querySelector(`[data-idx="${resultIndex}"].user-upload-save-btn`);
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
      }
      
      
      setSavingResultIndex(null);
    }
  };

  const handleDeleteResult = (resultIndex) => {
    const updatedResults = results.filter((_, index) => index !== resultIndex)
    setResults(updatedResults)
  }

  const getDiseaseSuggestions = (result, t) => {
    if (result.result && result.result !== "Healthy") {
      const key = result.result // e.g. Blight
      return t(`diseaseSuggestions.${key}`, { returnObjects: true })
    }
    return result.result === "Healthy"
      ? t('diseaseSuggestions.Healthy', { returnObjects: true })
      : t('diseaseSuggestions.Default', { returnObjects: true })
  }

  useEffect(() => {
    return () => {
      // release all preview URLs when component unmounts
      files.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, []);

  return (
    <main className="user-upload-dashboard-content">
      <div className="user-upload-container">
        <h2>{t("uploadMaizeImages") || "Upload Maize Images"}</h2>

        {/* Upload box with drag/drop and preview area */}
        <div
          className={`user-upload-box ${dragActive ? "drag-active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {files.length > 0 ? (
            <div className="user-upload-preview-gallery">
              {files.map((file, index) => (
                <div className="user-upload-preview-wrapper" key={index}>
                  <img 
                    src={file.previewUrl || "/placeholder.svg"} 
                    alt="Preview" 
                    className="user-upload-preview-image"
                    onError={(e) => handleImageError(e, index)} 
                  />
                  <div className="user-upload-preview-meta">
                    <div className="user-upload-preview-filename" title={file.name}>
                      {file.name}
                    </div>
                    <button className="user-upload-remove-btn" onClick={() => handleRemove(index)}>
                      {t("remove") || "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <img src={uploadIcon} alt="Upload" />
                <p>
                  {t("dragAndDrop", {
                    isPremium: isPremium ? "(s)/ZIP" : "",
                  })}{" "}
                  <span className="user-upload-browse" onClick={triggerFileSelect}>
                    {t("browse")}
                  </span>
                </p>
                <p>
                  {t("supportedFormats", {
                    formats: isPremium ? "ZIP, png, jpg, jpeg" : "png, jpg, jpeg"
                  })}
                </p>
            </>
          )}
          <input
            type="file"
            accept={isPremium ? ".zip,image/*" : "image/*"}
            multiple={isPremium}
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Show image count if uploaded */}
        <div className="user-upload-info">
          {files.length > 0 && (
            <div className="user-upload-image-type">
              {t("imageCount") || "Image Count"}: <span className="user-upload-radio-selected">{files.length}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="user-upload-button-group">
          <button className="user-upload-reset-btn" onClick={handleReset}>
            {t("reset") || "Reset"}
          </button>
          <button className="user-upload-submit-btn" onClick={handleCount} disabled={isCountLoading || isDiseaseLoading}>
            {isCountLoading ? t("counting") || "Counting..." : t("count") || "Count"}
          </button>
          
          {isPremium ? (
            <button className="user-upload-premium-btn" disabled={isCountLoading || isDiseaseLoading} onClick={handleDisease}>
              {isDiseaseLoading ? t("checking") || "Checking..." : t("checkDisease") || "Check Disease"}
            </button>
          ) : (
            <button 
              className="user-upload-upgrade-btn" 
              onClick={() => navigate('/subscription')}
            >
              {t("upgradeToPremium") || "Upgrade to Premium"}
            </button>
          )}
        </div>
        {!isPremium && (
          <div style={{ color: "#e53935", marginTop: 8, fontSize: 14 }}>
            {t("premiumFeatureAlert") || "Premium feature - upgrade to access disease detection"}
          </div>
        )}
      </div>

      {/* Maize confirmation modal */}
      {showMaizeConfirm && pendingCountFile && (
        <div className="user-upload-modal">
          <div className="user-upload-modal-content">
            <p>{t("notMaizeConfirm") || "This does not appear to be a maize image. Continue anyway?"}</p>

            <div style={{ fontSize: "0.85rem", color: "#666", margin: "6px 0 8px" }}>
              {(t("remainingImages") || "Remaining")} : {pendingTasks.length + 1} {t("images") || "images"}
            </div>

            {/* show cannot count img*/}
            <img
              src={pendingCountFile.previewUrl || "/placeholder.svg"}
              alt={pendingCountFile.name}
              style={{ maxWidth: "100%", maxHeight: "100%", margin: "10px 0", borderRadius: "8px" }}
            />
            <div style={{ fontSize: "0.9em", color: "#666" }}>
              {pendingCountFile.name}
            </div>

            <button onClick={() => handleMaizeConfirm(true)}>
              {t("continueDetection") || "Continue"}
            </button>
            <button onClick={() => handleMaizeConfirm(false)}>
              {t("cancel") || "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* Disease tip modal */}
      {showDiseaseTip && (
        <div className="user-upload-modal">
          <div className="user-upload-modal-content">
            <p>{t("singleLeafTip") || "For best results, upload images of single leaves."}</p>
            <div style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              justifyContent: "center",
              alignItems: "center"
            }}>

              <button onClick={doDisease}>
                {t("continueDetectionAcknowledge") || "Continue"}
              </button>

              <button
                onClick={() => setShowDiseaseTip(false)}
              >
                {t("cancel") || "Back"}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && (
        <div
          className="user-upload-modal"
          onClick={() => setShowImageModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
        >
          <img
            src={modalImageUrl}
            alt="Preview"
            style={{
              display: "block",
              borderRadius: "8px",
              maxWidth: "70vw",
              maxHeight: "70vh"
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "2rem"
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowImageModal(false);
            }}
          >
            {t("back") || "Back"}
          </button>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="user-upload-modal">
          <div className="user-upload-modal-content">
            <h3>{t("AddNote") || "Add Note"}</h3>
            <p>{t("AddDescription") || "Add a description or note for this result:"}</p>
            
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder={t("EnterNote") || "Enter your notes here..."}
              style={{
                width: "100%",
                height: "100px",
                marginTop: "10px",
                marginBottom: "15px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical"
              }}
            />
            
            <div style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "15px"
            }}>
              <button 
                className="user-upload-submit-btn"
                onClick={() => saveResultWithNote()}
              >
                {t("save") || "Save"}
              </button>
              <button
                className="user-upload-reset-btn"
                onClick={() => {
                  setShowNoteModal(false);
                  setCurrentNote('');
                  setSavingResultIndex(null);
                }}
              >
                {t("cancel") || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="user-upload-modal">
          <div className="user-upload-modal-content">
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p style={{ textAlign: "center", fontSize: "1.2rem" }}>{successMessage}</p>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px"
            }}>
              <button 
                className="user-upload-submit-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                {t("ok") || "OK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="user-upload-results-container">
          <h3>{t("results") || "Results"}</h3>
          {results.map((res, idx) => (
            <div key={idx} className="user-upload-result-layout">
              {/* Blue box - Generated results image */}
              <div className="user-upload-result-box user-upload-blue-box">
                {res.image_base64 ? (
                  <img
                    src={`data:image/jpeg;base64,${res.image_base64}`}
                    alt="Generated Result"
                    className="user-upload-result-image"
                  />
                ) : (
                  <img src={res.previewUrl || "/placeholder.svg"} alt="Original" className="user-upload-result-image" />
                )}
              </div>

              {/* Grey box - Count/Disease results */}
              <div className="user-upload-result-box user-upload-grey-box">
                <h4>{t("analysisResult") || "Analysis Result"}</h4>
                <div className="user-upload-result-content">
                  {res.taskType === "disease" && (
                    <div className="user-upload-result-text">
                      <strong>{t("disease") || "Disease:"}</strong> {t(`diseaseNames.${res.result}`) || res.result}
                    </div>
                  )}
                  {res.taskType === "count" && (
                    <div className="user-upload-result-text">
                      <strong>{t("count") || "Count:"}</strong> {res.result}
                    </div>
                  )}
                  {res.error && <div className="user-upload-error-text">{res.error}</div>}
                </div>
                <button
                  className="user-result-view-btn"
                  onClick={() => {
                    const url = res.image_base64
                      ? `data:image/jpeg;base64,${res.image_base64}`
                      : res.previewUrl
                    setModalImageUrl(url)
                    setShowImageModal(true)
                  }}
                >
                  {t("viewImage") || "View Image"}
                </button>
              </div>

              {/* Yellow box - Disease suggestions */}
              {res.taskType === "disease" && (
                <div className="user-upload-result-box user-upload-yellow-box">
                  <h4>{t("suggestions") || "Suggestions"}</h4>
                  <div className="user-upload-suggestion-content">
                    {getDiseaseSuggestions(res, t)}
                  </div>
                </div>
              )}

              {/* Green box - Save and Delete buttons */}
              <div className="user-upload-result-box user-upload-green-box">
                <h4>{t("actions") || "Actions"}</h4>
                <div className="user-upload-action-buttons">
                  <button 
                    className="user-upload-save-btn" 
                    data-idx={idx} 
                    onClick={() => handleSaveResult(idx)}
                    disabled={res.savedToDatabase}
                  >
                    {res.savedToDatabase 
                      ? (t("saved") || "Saved") 
                      : (t("save") || "Save")}
                  </button>
                  <button 
                    className="user-upload-delete-btn" 
                    onClick={() => handleDeleteResult(idx)}
                  >
                    {t("delete") || "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}