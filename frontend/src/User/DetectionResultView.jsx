// DetectionResultView.jsx
import './UserResult.css';
import { useLocation } from 'react-router-dom';

export default function DetectionResultView() {
  const location = useLocation();

  const result = location.state || {
    id: 1,
    title: 'Annotated Image',
    date: 'Jun 10, 2023, 2:15 PM',
    imageUrl: '/images/pic1.jpg',
    count: 47,
    time: '1.2s',
    size: '1920 x 1080'
  };

  return (
        <main className="dashboard-content">
          <div className="detection-container">
            <h2 className="detection-title">Detection Result</h2>
            <div className="detection-grid">
              <img src={result.imageUrl} alt="Annotated" className="detection-image" />
              <div className="detection-info">
                <p><strong>Total Maize Count:</strong> {result.count}</p>
                <p><strong>Processing Time:</strong> {result.time}</p>
                <p><strong>Image Size:</strong> {result.size}</p>
              </div>
            </div>
            <div className="detection-buttons">
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Back
          </button>

            </div>
          </div>
        </main>
  );
}
