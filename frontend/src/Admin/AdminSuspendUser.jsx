import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminTopBar from './AdminTopBar';
import AdminSidebar from './AdminSidebar';
import "./AdminSuspendUser.css";

export default function AdminSuspendUser() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [existingSuspendInfo, setExistingSuspendInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [responseBox, setResponseBox] = useState({ show: false, message: '', onOk: null });
  const [confirmBox, setConfirmBox] = useState({ show: false, message: '', onConfirm: null });

  // Form states
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("one_day");
  const [customDays, setCustomDays] = useState("");

  // Fetch user details and existing suspension info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user details
        const userResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${userId}/with-role`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            throw new Error('Account not found');
          }
          throw new Error(`Failed to fetch user: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Check for existing suspension info
        try {
          const suspendResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/suspend-info/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (suspendResponse.ok) {
            const suspendData = await suspendResponse.json();
            setExistingSuspendInfo(suspendData);
            setReason(suspendData.reason || "");
          }
          // If 404, no existing suspension (which is fine)
        } catch (suspendError) {
          // Ignore errors for suspend info - user might not be suspended
          console.log('No existing suspension info found');
        }

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Calculate end date based on duration
  const calculateEndDate = () => {
    const today = new Date();
    let days = 0;

    switch (duration) {
      case "one_day":
        days = 1;
        break;
      case "one_month":
        days = 30;
        break;
      case "one_year":
        days = 365;
        break;
      case "permanent_ban":
        days = 36500; // 100 years as "permanent"
        break;
      case "custom":
        days = parseInt(customDays) || 1;
        break;
      default:
        days = 1;
    }

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);
    return endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Update account state to suspended
  const updateAccountState = async () => {
    try {
      const response = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: 'suspended'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update account state');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to suspend account: ${error.message}`);
    }
  };

  // Create or update suspension info
  const manageSuspensionInfo = async () => {
    const suspendData = {
      user_id: parseInt(userId),
      end_date: calculateEndDate(),
      reason: reason.trim()
    };

    try {
      if (existingSuspendInfo) {
        // Remove existing suspension info first
        await fetch(`https://fyp-backend-a0i8.onrender.com/api/suspend-info/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // Create new suspension info
      const response = await fetch(`https://fyp-backend-a0i8.onrender.com/api/suspend-info/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suspendData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create suspension record');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to manage suspension info: ${error.message}`);
    }
  };

  // Unsuspend user (reactivate account)
  const unsuspendUser = async () => {
    try {
      // Update account state to active
      const response = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: 'active'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to reactivate account');
      }

      // Remove suspension info
      await fetch(`https://fyp-backend-a0i8.onrender.com/api/suspend-info/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to unsuspend user: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setResponseBox({ show: true, message: "Please provide a reason for suspension.", onOk: null });
      return;
    }

    if (duration === "custom" && (!customDays || parseInt(customDays) < 1)) {
      setResponseBox({ show: true, message: "Please enter a valid number of days for custom duration.", onOk: null });
      return;
    }

    setSubmitting(true);

    try {
      // Update account state to suspended
      await updateAccountState();
      
      // Create/update suspension info
      await manageSuspensionInfo();

      const durationText = duration === "custom" 
        ? `${customDays} days` 
        : duration.replace('_', ' ');

      setResponseBox({ 
        show: true, 
        message: `Successfully suspended user ${user.profile?.name || user.username} for ${durationText}.`, onOk: () => navigate(`/admin/user/${userId}`)});

    } catch (error) {
      console.error('Suspension failed:', error);
      setResponseBox({ 
        show: true, 
        message: `Suspension failed: ${error.message}`, onOk: null
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnsuspend = () => {
    setConfirmBox({
      show: true,
      message: `Are you sure you want to unsuspend ${user.profile?.name || user.username}?`,
      onConfirm: handleUnsuspendConfirmed
    });
  };

  const handleUnsuspendConfirmed = async () => {
    setConfirmBox({ show: false, message: '', onConfirm: null });
    setSubmitting(true);

    try {
      await unsuspendUser();

      setResponseBox({
        show: true,
        message: `Successfully unsuspended user ${user.profile?.name || user.username}.`,
        onOk: () => navigate(`/admin/user/${userId}`)
      });
    } catch (error) {
      console.error('Unsuspension failed:', error);
      setResponseBox({
        show: true,
        message: `Unsuspension failed: ${error.message}`,
        onOk: null
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-content">
            <div className="adminSus-loading-container">
              <div className="loading-spinner">Loading account details...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-content">
            <div className="adminSus-error-container">
              <h2>Error Loading Account</h2>
              <p>{error || 'Account not found'}</p>
              <div className="adminSus-error-actions">
                <button onClick={() => navigate('/admin/accounts')} className="admin-btn admin-btn-secondary">
                  Back to Accounts
                </button>
                <button onClick={() => window.location.reload()} className="admin-btn admin-btn-primary">
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const displayName = user.profile?.name || user.username;
  const isCurrentlySuspended = user.state === 'suspended';

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <h1 className="admin-user-details-header">
            {isCurrentlySuspended ? 'Manage Suspension' : 'Suspend Confirmation'}
          </h1>
          
          {isCurrentlySuspended && (
            <div className="suspension-status-alert">
              <p><strong>⚠️ This account is currently suspended</strong></p>
              {existingSuspendInfo && (
                <div className="current-suspension-info">
                  <p><strong>Current suspension ends:</strong> {new Date(existingSuspendInfo.end_date).toLocaleDateString()}</p>
                  <p><strong>Current reason:</strong> {existingSuspendInfo.reason}</p>
                </div>
              )}
            </div>
          )}
          
          <p>
            {isCurrentlySuspended 
              ? 'You can modify the suspension or unsuspend this account:' 
              : 'You are trying to suspend account:'
            }
          </p>
          <p className="admin-user-id-name">
            <strong>{user.account_id} ({displayName})</strong>
          </p>

          <label className="admin-form-label">
            Reason
            <textarea
              className="admin-form-textarea"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter reason for suspension"
              rows={5}
              disabled={submitting}
            />
          </label>

          <label className="admin-form-label">
            Suspend duration
            <select
              className="admin-form-select"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              disabled={submitting}
            >
              <option value="one_day">One day</option>
              <option value="one_month">One month</option>
              <option value="one_year">One year</option>
              <option value="permanent_ban">Permanent ban</option>
              <option value="custom">Custom (days)</option>
            </select>
          </label>

          {duration === "custom" && (
            <input
              type="number"
              className="admin-form-input"
              value={customDays}
              onChange={e => setCustomDays(e.target.value)}
              placeholder="Enter number of days"
              min={1}
              disabled={submitting}
            />
          )}

          <div className="admin-buttons-container">
            <button 
              className="admin-btn admin-btn-danger" 
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            
            {isCurrentlySuspended && (
              <button 
                className="admin-btn admin-btn-warning" 
                onClick={handleUnsuspend}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Unsuspend User'}
              </button>
            )}
            
            <button 
              className="admin-btn admin-btn-success" 
              onClick={handleSubmit}
              disabled={submitting || !reason.trim()}
            >
              {submitting ? 'Processing...' : (isCurrentlySuspended ? 'Update Suspension' : 'Confirm Suspension')}
            </button>
          </div>

          {/* Preview of suspension details */}
          {reason.trim() && (
            <div className="suspension-preview">
              <h3>Suspension Details Preview:</h3>
              <p><strong>End Date:</strong> {new Date(calculateEndDate()).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> {duration === "custom" ? `${customDays} days` : duration.replace('_', ' ')}</p>
              <p><strong>Reason:</strong> {reason}</p>
            </div>
          )}

          {confirmBox.show && (
            <div className="susUser-modal-overlay">
              <div className="susUser-modal-box">
                <p>{confirmBox.message}</p>
                <button className="susUser-btn susUser-btn-confirm" onClick={() => {
                  if (confirmBox.onConfirm) confirmBox.onConfirm();
                  setConfirmBox({ show: false, message: '', onConfirm: null });
                }}>Yes</button>
                <button className="susUser-btn susUser-btn-cancel" onClick={() => setConfirmBox({ show: false, message: '', onConfirm: null })}>No</button>
              </div>
            </div>
          )}

          {responseBox.show && (
            <div className="susUser-modal-overlay">
              <div className="susUser-modal-box">
                <p>{responseBox.message}</p>
                <button className="susUser-btn susUser-btn-ok" onClick={() => {
                  if (responseBox.onOk) responseBox.onOk();
                  setResponseBox({ show: false, message: '', onOk: null });
                }}>Ok</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}