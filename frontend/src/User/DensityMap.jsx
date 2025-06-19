import React, { useState } from 'react';
import './DensityMap.css';


const DensityMap = () => {
  const [selectedLevel, setSelectedLevel] = useState('LOW');

  return (
    <div className="density-layout">
      <main className="density-main">
        {/* Header: Title + Date */}
        <div className="density-header">
          <h1>Density Map</h1>
          <span className="density-date">June 12, 2024</span>
        </div>

        {/* Main Content: Image + Info */}
        <div className="density-body">
          <div className="density-image">
            <img src="/placeholder-map.png" alt="Density Map" />
          </div>

          <div className="density-info">
            <h2>Density Map</h2>

            {/* Toggle buttons */}
            <div className="density-toggle">
              {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                <button
                  key={level}
                  className={selectedLevel === level ? 'active' : ''}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Stats */}
            <p><strong>Image analyzed:</strong> 520 detections</p>
            <p><strong>Average density:</strong> 3.4 / m²</p>
            <p><strong>High density:</strong> 17%</p>
            <p><strong>Low density:</strong> 9%</p>

            {/* Observation */}
            <p><strong>Observations:</strong><br />Consider thinning the upper-left area</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="density-actions">
          <button className="btn download">Download Map</button>
          <button className="btn back">Back to Dashboard</button>
        </div>
      </main>
    </div>
  );
};

export default DensityMap;
