import React, { useState } from 'react';
import './ReAnnotate.css';

const ReAnnotate = () => {
  const [updated, setUpdated] = useState(false);

  const handleReannotate = () => {
    setUpdated(true);
  };

  const handleManualEdit = () => {
    alert('Manual edit mode not implemented yet.');
  };

  return (
    <div className="annotate-layout">
      <main className="annotate-main">
        <h1>Re-annotate Labels</h1>
        <hr />
        <div className="annotate-image">
          <img src="/sample-image.png" alt="Annotated Crop" />
        </div>
        <div className="annotate-meta">
          <span>Previous Count: 47</span>
          <span>Last Annotated: June 2, 2024</span>
        </div>
        <div className="annotate-buttons">
          <button onClick={handleReannotate}>Re-annotate</button>
          <button onClick={handleManualEdit}>Manual Edit</button>
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
