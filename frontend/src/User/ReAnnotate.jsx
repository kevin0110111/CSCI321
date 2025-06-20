import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ReAnnotate.css';

const ReAnnotate = () => {
  const location = useLocation();
  const imageUrl = location.state?.image || '/sample-image.png';
  const [updated, setUpdated] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [start, setStart] = useState(null);
  const [rect, setRect] = useState(null);
  const [boxes, setBoxes] = useState([]);

  const imageRef = useRef(null);

  const handleReannotate = () => {
    setUpdated(true);
  };

  const handleManualEdit = () => {
    alert('Manual edit not implemented.');
  };

const handleMouseDown = (e) => {
  if (!selecting) return;
  if (!imageRef.current) return;

  const rect = imageRef.current.getBoundingClientRect();
  setStart({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  });
  setRect(null);
};

const handleMouseMove = (e) => {
  if (!selecting || !start || !imageRef.current) return;

  const rect = imageRef.current.getBoundingClientRect();
  const current = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  setRect({
    x: Math.min(start.x, current.x),
    y: Math.min(start.y, current.y),
    width: Math.abs(current.x - start.x),
    height: Math.abs(current.y - start.y)
  });
};



  const handleMouseUp = () => {
  if (selecting && rect) {
    setBoxes(prev => [...prev, rect]);  
    setRect(null);                       
    setSelecting(false);
    setStart(null);
  }
};


  return (
    <div className="annotate-layout">
      <main className="annotate-main">
        <h1>Re-annotate Labels</h1>
        <hr />
        <div
          className="annotate-image"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <img ref={imageRef} src={imageUrl} alt="Annotated Crop" />
          {/* 当前正在画的临时框 */}
            {rect && (
              <div
                className="selection-rect"
                style={{
                  left: `${rect.x}px`,
                  top: `${rect.y}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`
                }}
              ></div>
            )}

            {/* 所有已完成的框 */}
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
              ></div>
            ))}



        </div>

        <div className="annotate-meta">
          <span>Previous Count: 47</span>
          <span>Last Annotated: June 2, 2024</span>
        </div>

        <div className="annotate-buttons">
          <button onClick={handleReannotate}>Re-annotate</button>
          <button onClick={handleManualEdit}>Manual Edit</button>
          <button onClick={() => setSelecting(true)}>Select Region</button>
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

