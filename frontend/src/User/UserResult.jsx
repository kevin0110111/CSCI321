// UserResultHistory.jsx
import './userResult.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

export default function UserResultHistory() {
  const navigate = useNavigate();


  const results = [
    {
      id: 1,
      title: 'Annotated image',
      date: 'Jun 03, 2025, 7:17 PM',
      imageUrl: '/countexample.png', 
      count: 47,
      time: '1.2s',
      size: '1920 x 1080',
    },
    {
      id: 2,
      title: 'Annotated image',
      date: 'Jun 05, 2025, 6:16 PM',
      imageUrl: '/countexample2.png',
      count: 32,
      time: '0.9s',
      size: '1280 x 720',
    },
    {
      id: 3,
      title: 'Annotated image',
      date: 'Jun 17, 2025, 3:14 PM',
      imageUrl: '/countexample3.png',
      count: 51,
      time: '1.5s',
      size: '1920 x 1080',
    },
  ];

    useEffect(() => {
      document.title = 'View Result';
    }, []);
  
  return (
        <main className="dashboard-content">
          <div className="result-list-container">
            <h2>My Results</h2>
            {results.map((item) => (
              <div className="result-row" key={item.id}>
                <img src={item.imageUrl} alt="Thumbnail" className="result-thumb" />
                <div className="result-meta">
                  <div className="result-title">{item.title}</div>
                  <div className="result-date">{item.date}</div>
                </div>
                <div className="result-actions">
                  <button
                    className="user-view-btn"
                    onClick={() =>
                      navigate('/user/resultview', {
                        state: item,
                      })
                    }
                  >
                    View
                  </button>
                  <button className="user-delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </main>
  );
}
