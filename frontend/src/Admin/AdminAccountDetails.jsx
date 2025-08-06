import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminAccountDetails.css";

export default function AdminAccountDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8000/api/accounts/${userId}/with-role`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Account not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const accountData = await response.json();
        
        // Transform API data to the expected format
        const transformedUser = {
          id: accountData.account_id,
          name: accountData.profile?.name || accountData.username,
          username: accountData.username,
          email: accountData.email,
          role: accountData.role?.role_name || 'User',
          avatar_url: accountData.avatar_url,
          region: accountData.region,
          state: accountData.state,
          is_premium: accountData.is_premium,
          subscription_expiry: accountData.subscription_expiry,
          createDate: accountData.createDate,
          role_id: accountData.role_id,
          // Profile information
          profile: accountData.profile ? {
            name: accountData.profile.name,
            dob: accountData.profile.dob,
            job: accountData.profile.job,
            institution: accountData.profile.institution,
            reason_foruse: accountData.profile.reason_foruse,
            profile_preferred_language: accountData.profile.profile_preferred_language
          } : null
        };

        setUser(transformedUser);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (!user) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-content">
            <h2>User not found</h2>
          </main>
        </div>
      </div>
    );
  }

  const handleSuspendClick = () => {
    navigate(`/admin/suspend-user/${userId}`);
  };

  const handleUpdateDetailsClick = () => {
    navigate(`/admin/update-user/${userId}`);
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <h2 className="admin-user-details-header">User Details</h2>

          <section className="admin-user-info-section">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </section>

          <div className="admin-buttons-container">
            <button className="admin-btn admin-btn-danger" onClick={handleSuspendClick}>
              Suspend User
            </button>
            <button className="admin-btn admin-btn-success" onClick={handleUpdateDetailsClick}>
              Update Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
