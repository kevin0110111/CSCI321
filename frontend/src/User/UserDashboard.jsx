import './UserDashboard.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';
import './ImageCarousel.css';
import { useNavigate } from 'react-router-dom';


function ImageCarousel() {
    const images = [
        "/images/pic1.jpg",
        "/images/pic2.jpg",
        "/images/pic3.jpg",
        "/images/pic4.jpg",
        "/images/pic5.jpg",
        "/images/pic6.jpg",
    ];

    const [current, setCurrent] = useState(0);
    const listRef = useRef(null);

    const total = images.length;

    const getIndex = (offset) => (current + offset + total) % total;

    const next = () => {
        setCurrent((prev) => (prev + 1) % total);
    };

    const prev = () => {
        setCurrent((prev) => (prev - 1 + total) % total);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 4000);
        return () => clearInterval(timer);
    }, [total]);

    return (
        <div className="carousel-wrapper">
            <button className="arrow left" onClick={prev}>&#10094;</button>
            <div className="carousel-view">
                <div className="carousel-track" ref={listRef}>
                    {[...Array(5)].map((_, i) => {
                        const offset = i - 2; // center is at position 2
                        const index = getIndex(offset);
                        const isActive = offset === 0;

                        return (
                            <img
                                key={index}
                                src={images[index]}
                                alt={`img-${index}`}
                                className={`carousel-img ${isActive ? "active" : "blur"}`}
                            />
                        );
                    })}
                </div>
            </div>
            <button className="arrow right" onClick={next}>&#10095;</button>
        </div>
    );
    }


export default function UserDashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Dashboard';
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="user-dashboard">
            {/* 顶部栏 */}
            <div className="dashboard-header">
                <div className="menu-icon" onClick={toggleSidebar}>
                    &#9776;
                </div>

                <div className="product-logo">
                    <img src={logo} alt="Product Logo" className="logo-img" />
                    <span className="product-name">MaizeTassel AI</span>
                </div>

                <div className="avatar-box" onClick={() => navigate('/updateUserAccount')} style={{ cursor: 'pointer' }}>
                    <img src={avatar} alt="User Avatar" className="avatar-img" />
                </div>
            </div>


        {/* 主内容区 */}
        <div className="dashboard-body">
            <div className={`usersidebar ${sidebarOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/userDashboard">Dashboard</Link></li>
                    <li><Link to="/userupload">Upload image</Link></li>
                    <li><Link to="/userResult">View result history</Link></li>
                    <li><a href="/userSubscription">Subscription</a></li>
                    <li><a href="/reportBug">Report a Bug</a></li>
                    <li><Link to="/login">Log out</Link></li>
                </ul>
            </div>

            <main className="dashboard-content">
                <ImageCarousel />

                <h2 className="welcome-text">Welcome back! User xxx</h2>
                <hr className="divider" />

                {/* Weather Forecast Box */}
                <div className="weather-container">
                    <div className="weather-card-large">
                        <div className="weather-header">
                            <span className="location-icon">📍</span>
                            <span className="weather-location">Singapore</span>
                        </div>
                            <hr className="weather-header-line" />

                        <div className="weather-row">
                            <div className="weather-info-box">
                            <div className="weather-main-info">
                                <div className="weather-left">
                                    <div className="weather-today-label">Today</div>
                                    <img src="/sun.png" alt="Weather Icon" className="weather-icon-lg" />
                                </div>
                                <div className="weather-divider"></div>
                                <div className="weather-right">
                                    <div className="temp-now">32°C</div>
                                    <div className="desc">Sunny</div>
                                    <div className="wind-humidity">
                                        Wind: 5 km/h<br />
                                        Humidity: 60%
                                    </div>
                                </div>
                            </div>
                            </div>

                            {/* 右侧：提醒框 */}
                            <div className="weather-alert-card">
                                <span className="alert-icon">⚠️</span>
                                <p>Heavy rain expected later today</p>
                            </div>
                        </div>


                        <div className="weather-forecast-row">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",].map((day, idx) => (
                                <div className="weather-forecast" key={idx}>
                                    <div className="day">{day}</div>
                                    <img src="/rain.png" alt="forecast" />
                                    <div className="temps">30° / 24°</div>
                                </div>
                            ))}
                        </div>

                        <div className="last-updated">Last updated 1 hour ago</div>
                    </div>
                </div>
            </main>
        </div>
        </div>
    );
}
