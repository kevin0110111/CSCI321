import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminProfileDetails.css";

const allPermissions = [
  "Update Account",
  "Manage Accounts",
  "Access Database",
  "Use System",
  "Update Models",
  "Reply Comments",
];

export default function AdminProfileDetails() {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch role details from API
  useEffect(() => {
    const fetchRoleDetails = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`http://localhost:8000/api/roles/${roleId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Role not found");
          } else {
            throw new Error('Failed to fetch role details');
          }
          return;
        }
        
        const roleData = await response.json();
        
        // Transform API data to match component expectations
        const transformedRole = {
          id: roleData.role_id,
          role: roleData.role_name,
          description: roleData.description || "",
          permissions: roleData.description ? roleData.description.split(", ").filter(p => p.trim()) : [],
          state: roleData.state
        };
        
        setRole(transformedRole);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching role details');
        console.error('Error fetching role details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (roleId) {
      fetchRoleDetails();
    }
  }, [roleId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-content">
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div>Loading role details...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state or role not found
  if (error || !role) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-content">
            <div style={{ padding: '20px' }}>
              <h2 style={{ color: 'red', marginBottom: '20px' }}>
                {error || "Role not found"}
              </h2>
              <button
                className="admin-btn-back"
                onClick={() => navigate('/admin/profiles')}
                style={{ 
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Back to Profiles
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <h1 className="admin-page-title">Role Details - {role.role}</h1>
            {role.state === 'suspended' && (
              <span style={{ 
                background: '#ff9800', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Suspended
              </span>
            )}
          </div>

          <hr className="admin-section-divider-profile-details" />
          
          <div className="admin-role-details-container">
            <label className="admin-form-label">
              Role Name
              <input
                type="text"
                className="admin-form-input"
                value={role.role}
                readOnly
              />
            </label>
            
            <hr className="admin-section-divider-profile-details" />

            <fieldset className="admin-permissions-fieldset">
              <legend className="admin-permissions-legend">Permissions</legend>
              {allPermissions.map((perm) => (
                <label key={perm} className="admin-permission-label">
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(perm)}
                    disabled
                  />
                  <span className="admin-permission-text">{perm}</span>
                </label>
              ))}
            </fieldset>
            
            <hr className="admin-section-divider-profile-details" />
            
            <div className="admin-buttons-container">
              <button
                className="admin-btn-back"
                onClick={() => navigate(`/admin/view-profiles`)}
                style={{ marginTop: "20px" }}
              >
                Cancel
              </button>
              <button
                className="admin-btn-update"
                onClick={() => navigate(`/admin/update-profile/${role.id}`)}
                style={{ marginTop: "20px" }}
              >
                Update 
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}