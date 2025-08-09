import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import avatar from '../assets/user.png';
import './dashboardLayout.css';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        navigate('/login');
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
                    <span className="product-name">Tassel AI</span>
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
                        <li><Link to="/user/upload" onClick={() => setSidebarOpen(false)}>Upload Image</Link></li>
                        <li><Link to="/user/result" onClick={() => setSidebarOpen(false)}>View Result History</Link></li>
                        <li><Link to="/user/subscription" onClick={() => setSidebarOpen(false)}>Subscription</Link></li>
                        <li><Link to="/user/diseasereport" onClick={() => setSidebarOpen(false)}>Disease Detection</Link></li>
                        <li><Link to="/user/faq" onClick={() => setSidebarOpen(false)}>FAQ / Help</Link></li>
                        <li><Link to="/user/reportBug" onClick={() => setSidebarOpen(false)}>Report a Bug</Link></li>
                        <li><Link to="/user/leaveComment" onClick={() => setSidebarOpen(false)}>Leave a Comment</Link></li>
                        <li><Link to="/user/comments" onClick={() => setSidebarOpen(false)}>User Comments</Link></li>
                        <li><Link to="/user/switchLanguage" onClick={() => setSidebarOpen(false)}>Switch Language</Link></li>
                        <li><Link to="/user/deleteAccount" onClick={() => setSidebarOpen(false)}>Delete Account</Link></li>
                        <li onClick={handleLogout}>
                            <a style={{ cursor: 'pointer' }}>Log out</a>
                        </li>

                    </ul>

                </div>
                {sidebarOpen && (
                    <div className="overlay" onClick={toggleSidebar}></div>
                )}
                <div className="dashboard-content">
                    <Outlet />
                </div>

                {/* Logout Confirmation Modal */}
                {showLogoutModal && (
                    <div className="logout-modal">
                        <div className="modal-box">
                            <p>Are you sure you want to log out?</p>
                            <div className="modal-actions">
                                <button onClick={confirmLogout}>Yes</button>
                                <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
