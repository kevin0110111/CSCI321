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
  const { t } = useTranslation()

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
    setFiles([])
    setResults([])
    fileInputRef.current.value = null
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
    const updatedFiles = files.filter((_, index) => index !== indexToRemove)
    setFiles(updatedFiles)
    fileInputRef.current.value = null
  }

  // Count button logic
  const handleCount = async () => {
    if (files.length === 0) {
      alert(t("uploadImageFirstAlert") || "Please upload an image first")
      return
    }
    setLoading(true)
    setResults([]) // Clear old results
    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append("file", file.file || file)
        formData.append("task", "detect")
        const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData)
        if (resp.data.result !== "maize") {
          // Not maize, show confirmation dialog
          setPendingCountFile(file)
          setShowMaizeConfirm(true)
          setLoading(false)
          return // Stop at first non-maize image, wait for user confirmation
        }
        await doCount(file, file.previewUrl)
      } catch (e) {
        setResults((prev) => [
          ...prev,
          { error: t("detectionFailed") || "Detection failed", previewUrl: file.previewUrl },
        ])
      }
    }
    setLoading(false)
  }

  // Count after user confirmation
  const handleMaizeConfirm = async (goOn) => {
    setShowMaizeConfirm(false)
    if (goOn && pendingCountFile) {
      setLoading(true)
      await doCount(pendingCountFile)
      setLoading(false)
    }
    setPendingCountFile(null)
  }

  // Actual count model call
  const doCount = async (file, previewUrl) => {
    try {
      const formData = new FormData()
      formData.append("file", file.file || file)
      formData.append("task", "count")
      const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData)
      setResults((prev) => [...prev, { ...resp.data, previewUrl }])
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
    setLoading(true)
    setResults([]) // Clear old results
    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append("file", file.file || file)
        formData.append("task", "disease")
        const resp = await axios.post(`${BASE_API_URL}/models/active/predict`, formData)
        setResults((prev) => [...prev, { ...resp.data, previewUrl: file.previewUrl }])
      } catch (e) {
        setResults((prev) => [
          ...prev,
          { error: t("diseaseDetectionFailed") || "Disease detection failed", previewUrl: file.previewUrl },
        ])
      }
    }
    setLoading(false)
  }

  const handleSaveResult = (resultIndex) => {
    // Implementation for saving result
    console.log("Saving result:", results[resultIndex])
    // You can add your save logic here
  }

  const handleDeleteResult = (resultIndex) => {
    const updatedResults = results.filter((_, index) => index !== resultIndex)
    setResults(updatedResults)
  }

  const getDiseaseSuggestions = (result) => {
    if (result.result && result.result !== "healthy") {
      // Return suggestions based on detected disease
      const suggestions = {
        leaf_blight: "Apply fungicide treatment and improve air circulation around plants.",
        rust: "Remove affected leaves and apply copper-based fungicide.",
        spot: "Ensure proper drainage and avoid overhead watering.",
        default: "Consult with agricultural extension services for proper treatment.",
      }
      return suggestions[result.result] || suggestions.default
    }
    return result.result === "healthy"
      ? "Plant appears healthy. Continue regular monitoring."
      : "No specific suggestions available."
  }

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
                  <img src={file.previewUrl || "/placeholder.svg"} alt="Preview" className="user-upload-preview-image" />
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
          <button className="user-upload-submit-btn" onClick={handleCount} disabled={loading}>
            {loading ? t("counting") || "Counting..." : t("count") || "Count"}
          </button>
          <button className="user-upload-premium-btn" disabled={!isPremium || loading} onClick={handleDisease}>
            {loading ? t("checking") || "Checking..." : t("checkDisease") || "Check Disease (Premium)"}
          </button>
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
            <button onClick={doDisease}>{t("continueDetectionAcknowledge") || "Continue"}</button>
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
                <h4>Generated Result</h4>
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
                <h4>Analysis Result</h4>
                <div className="user-upload-result-content">
                  {res.result && (
                    <div className="user-upload-result-text">
                      <strong>Result:</strong> {res.result}
                    </div>
                  )}
                  {res.count && (
                    <div className="user-upload-result-text">
                      <strong>Count:</strong> {res.count}
                    </div>
                  )}
                  {res.confidence && (
                    <div className="user-upload-result-text">
                      <strong>Confidence:</strong> {(res.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                  {res.error && <div className="user-upload-error-text">{res.error}</div>}
                </div>
              </div>

              {/* Green box - Save and Delete buttons */}
              <div className="user-upload-result-box user-upload-green-box">
                <h4>Actions</h4>
                <div className="user-upload-action-buttons">
                  <button className="user-upload-save-btn" onClick={() => handleSaveResult(idx)}>
                    Save
                  </button>
                  <button className="user-upload-delete-btn" onClick={() => handleDeleteResult(idx)}>
                    Delete
                  </button>
                </div>
              </div>

              {/* Yellow box - Disease suggestions */}
              <div className="user-upload-result-box user-upload-yellow-box">
                <h4>Suggestions</h4>
                <div className="user-upload-suggestion-content">{getDiseaseSuggestions(res)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}