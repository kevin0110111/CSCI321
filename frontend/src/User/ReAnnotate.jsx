import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ReAnnotate.css';

const ReAnnotate = () => {
  const location = useLocation();
  const imageUrl = location.state?.image || '/sample-image.png';
  const [updated, setUpdated] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [boxes, setBoxes] = useState([]);

  const imageRef = useRef(null);

  const handleReannotate = () => {
    setUpdated(true);
  };

  const handleSave = () => {
    alert('Saved successfully.');
  };

const handleImageClick = (e) => {
  if (!imageRef.current) return;

  const rect = imageRef.current.getBoundingClientRect();
  const naturalWidth = imageRef.current.naturalWidth;
  const naturalHeight = imageRef.current.naturalHeight;

  const displayedWidth = rect.width;
  const displayedHeight = rect.height;

  
  const relativeX = (e.clientX - rect.left) / displayedWidth;
  const relativeY = (e.clientY - rect.top) / displayedHeight;

 
  const fixedWidth = 60;
  const fixedHeight = 40;

  const x = relativeX * displayedWidth - fixedWidth / 2;
  const y = relativeY * displayedHeight - fixedHeight / 2;

 
  const adjustedX = Math.max(0, Math.min(x, displayedWidth - fixedWidth));
  const adjustedY = Math.max(0, Math.min(y, displayedHeight - fixedHeight));

  const newBox = {
    x: adjustedX,
    y: adjustedY,
    width: fixedWidth,
    height: fixedHeight
  };

  setBoxes((prev) => [...prev, newBox]);
};



  return (
    <div className="annotate-layout">
      <main className="annotate-main">
        <h1>Re-annotate Labels</h1>
        <hr />
        <div className="annotate-image" onClick={handleImageClick}>
      <img ref={imageRef} src={imageUrl} alt="Annotated Crop" />

          {boxes.map((box, idx) => (
        <div
          key={idx}
          className="selection-rect"
          style={{
            left: `${box.x}px`,
            top: `${box.y}px`,
            width: `${box.width}px`,
            height: `${box.height}px`
          }}
          onContextMenu={(e) => {
            e.preventDefault(); 
            const confirmed = window.confirm(`Delete box #${idx + 1}?`);
            if (confirmed) {
              setBoxes(prev => prev.filter((_, i) => i !== idx));
            }
          }}
        >
          <span className="box-label">{idx + 1}</span>
        </div>
      ))}

    </div>

        <div className="annotate-meta">
          <span>Previous Count: 47</span>
          <span>Last Annotated: June 2, 2025</span>
        </div>

        <div className="annotate-buttons">
          <button onClick={handleReannotate}>Re-annotate</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => window.history.back()}>Back</button>
        </div>

        {updated && (
          <div className="annotate-success">
            Re-annotation complete. Updated count: 51
          </div>
        )}
      </main>
    </div>
  );
};

export default ReAnnotate;

