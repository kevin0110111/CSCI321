import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import avatar from '../assets/user.png';
import './dashboardLayout.css';
import { FaHome, FaUpload, FaHistory, FaComment, FaQuestionCircle, FaBug, FaCreditCard, FaSignOutAlt, FaLanguage } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { t } = useTranslation();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('accountId');
        localStorage.removeItem('account');
        sessionStorage.clear();
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
                        <li>
                            <Link to="/user/dashboard" onClick={() => setSidebarOpen(false)}>
                                <FaHome style={{ marginRight: '10px', color: '#4CAF50' }} /> {t('dashboard')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/upload" onClick={() => setSidebarOpen(false)}>
                                <FaUpload style={{ marginRight: '10px', color: '#4CAF50' }} /> {t('uploadImage')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/result" onClick={() => setSidebarOpen(false)}>
                                <FaHistory style={{ marginRight: '10px', color: '#4CAF50' }} /> {t('resultHistory')}
                            </Link>
                        </li>
                        <hr className="sidebar-divider" />
                        <li>
                            <Link to="/user/comments" onClick={() => setSidebarOpen(false)}>
                                <FaComment style={{ marginRight: '10px', color: '#4CAF50' }} /> {t('comment')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/faq" onClick={() => setSidebarOpen(false)}>
                                <FaQuestionCircle style={{ marginRight: '10px', color: '#4CAF50' }} /> {t('faqHelp')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/reportBug" onClick={() => setSidebarOpen(false)}>
                                <FaBug style={{ marginRight: '10px', color: '#4CAF50' }} /> {t('reportBug')}
                            </Link>
                        </li>
                        <hr className="sidebar-divider" />
                        <li>
                            <Link to="/user/subscription" onClick={() => setSidebarOpen(false)}>
                                <FaCreditCard style={{ marginRight: '10px', color: '#4CAF50' }} /> {t('subscription')}
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/switchLanguage" onClick={() => setSidebarOpen(false)}>
                                <FaLanguage style={{ marginRight: '10px', color: '#4CAF50' }} /> {t('translate')}
                            </Link>
                        </li>
                        <li onClick={handleLogout}>
                            <a style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <FaSignOutAlt style={{ marginRight: '10px', color: '#FF5722' }} /> {t('logout')}
                            </a>
                        </li>
                    </ul>

                </div>
                {sidebarOpen && (
                    <div className="overlay" onClick={toggleSidebar}></div>
                )}
                <div className="dashboard-content">
                    <Outlet />
                </div>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <p>
                        © {new Date().getFullYear()} Tassel AI. All rights reserved.
                    </p>
                </footer>

                {/* Logout Confirmation Modal */}
                {showLogoutModal && (
                    <div className="logout-modal">
                        <div className="modal-box">
                            <p>{t('logoutConfirm')}</p>
                            <div className="modal-actions">
                                <button onClick={confirmLogout}>{t('yes')}</button>
                                <button onClick={() => setShowLogoutModal(false)}>{t('cancel')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
