import React from 'react';
import './DiseaseReport.css';

const DiseaseReport = () => {
  return (
    <div className="report-layout">
      <main className="report-main">
        <div className="report-header">
          <h1>Disease Detection Report</h1>
        </div>

        <div className="report-body">
          {/* Left: Image */}
          <div className="report-image">
            <img src="/placeholder-report.png" alt="Detected Crop" />
          </div>

          {/* Right: Text Content */}
          <div className="report-content">
            <div className="report-summary">
              <p><strong>Date analyzed:</strong> 2024-06-10</p>
              <p><strong>Model used:</strong> PlantNet v3.2</p>
              <p><strong>Detections found:</strong> 7</p>
            </div>
            <div className="report-details">
              <h2>Disease: Gray Leaf Spot</h2>
              <p><strong>Location:</strong> Box #2 and lower left</p>
              <p><strong>Confidence:</strong> 92%</p>
              <p><strong>Action:</strong> Apply fungicide and monitor</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiseaseReport;
