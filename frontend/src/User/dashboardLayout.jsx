import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/faq.svg';
import avatar from '../assets/logo.png';
import './dashboardLayout.css';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="user-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="menu-icon" onClick={toggleSidebar}>
                    &#9776;
                </div>

                <div className="product-logo">
                    <img src={logo} alt="Product Logo" className="logo-img" />
                    <span className="product-name">MaizeTassel AI</span>
                </div>

                <div
                    className="avatar-box"
                    onClick={() => navigate('/user/updateUserAccount')}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={avatar} alt="User Avatar" className="avatar-img" />
                </div>
            </div>

            {/* Sidebar */}
            <div className="dashboard-body">
                <div className={`usersidebar ${sidebarOpen ? 'open' : ''}`}>
                    <ul>
                        <li><Link to="/user/dashboard" onClick={() => setSidebarOpen(false)}>Dashboard</Link></li>
                        <li><Link to="/user/upload" onClick={() => setSidebarOpen(false)}>Upload image</Link></li>
                        <li><Link to="/user/result" onClick={() => setSidebarOpen(false)}>View result history</Link></li>
                        <li><Link to="/user/subscription" onClick={() => setSidebarOpen(false)}>Subscription</Link></li>
                        <li><Link to="/user/reportBug" onClick={() => setSidebarOpen(false)}>Report a Bug</Link></li>
                        <li><Link to="/user/leaveComment" onClick={() => setSidebarOpen(false)}>Leave a Comment</Link></li>
                        <li><Link to="/user/comments" onClick={() => setSidebarOpen(false)}>User Comments</Link></li>
                        <li><Link to="/user/switchLanguage" onClick={() => setSidebarOpen(false)}>Switch Language</Link></li>
                        <li><Link to="/login">Log out</Link></li>
                    </ul>
                </div>
                {sidebarOpen && (
                    <div className="overlay" onClick={toggleSidebar}></div>
                )}
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
