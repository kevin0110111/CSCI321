import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminUpdateProfileDetails.css";

const allPermissions = [
  "Update Account",
  "Manage Accounts",
  "Access Database",
  "Use System",
  "Update Models",
  "Reply Comments",
];

export default function AdminUpdateProfileDetails() {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [responseBox, setResponseBox] = useState({ show: false, message: '', onOk: null });

  // Fetch role details from API
  useEffect(() => {
    const fetchRoleDetails = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`https://fyp-backend-a0i8.onrender.com/api/roles/${roleId}`);
        
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
        setSelectedPermissions([...transformedRole.permissions]);
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

  const handlePermissionChange = (perm) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/profile/${roleId}`)
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      // Prepare update data - only updating permissions (description)
      const updateData = {
        description: selectedPermissions.join(", ")
      };

      // Make API call to update role
      const response = await fetch(`https://fyp-backend-a0i8.onrender.com/api/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update role');
      }

      const updatedRole = await response.json();
      
      setResponseBox({
        show: true,
        message: `Role "${updatedRole.role_name}" permissions updated successfully!`,
        onOk: () => navigate(`/admin/profile/${roleId}`)
      });
      
      // Update local role state
      const transformedRole = {
        id: updatedRole.role_id,
        role: updatedRole.role_name,
        description: updatedRole.description || "",
        permissions: updatedRole.description ? updatedRole.description.split(", ").filter(p => p.trim()) : [],
        state: updatedRole.state
      };
      
      setRole(transformedRole);

    } catch (err) {
      setResponseBox({
        show: true,
        message: err.message || 'An error occurred while updating the role',
        onOk: null
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if permissions have changed
  const hasPermissionsChanged = () => {
    if (!role) return false;
    return JSON.stringify(selectedPermissions.sort()) !== JSON.stringify(role.permissions.sort());
  };

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
  if (error && !role) {
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
                className="admin-update-profile-btn-cancel"
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

  if (!role) return null;

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <h1 className="admin-update-profile-title">UPDATE ROLE PERMISSIONS</h1>
          <p className="admin-update-profile-warning">Ensure the permissions are not abused</p>
          <hr className="admin-update-profile-divider" />

          {/* Current Role Display Section */}
          <section className="admin-update-profile-section">
            <h2 className="admin-update-profile-section-title">Current Role</h2>
            <label className="admin-update-profile-label">
              Role Name
              <input 
                type="text" 
                className="admin-update-profile-input" 
                value={role.role} 
                readOnly 
                style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
              />
            </label>
          </section>

          <hr className="admin-update-profile-divider" />

          {/* Change Permissions Section */}
          <section className="admin-update-profile-section">
            <h2 className="admin-update-profile-section-title">Update Permissions</h2>
            <fieldset className="admin-update-profile-permissions-fieldset">
              <legend className="admin-update-profile-permissions-legend">Permissions</legend>
              {allPermissions.map((perm) => (
                <label key={perm} className="admin-update-profile-permission-label">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => handlePermissionChange(perm)}
                    disabled={isUpdating}
                  />
                  <span className="admin-update-profile-permission-text">{perm}</span>
                </label>
              ))}
            </fieldset>
          </section>

          <hr className="admin-update-profile-divider" />

          {/* Buttons */}
          <div className="admin-update-profile-buttons">
            <button
              className="admin-update-profile-btn-cancel"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              className="admin-update-profile-btn-update"
              onClick={handleUpdate}
              disabled={isUpdating || !hasPermissionsChanged()}
              title={
                isUpdating ? "Updating..." :
                !hasPermissionsChanged() ? "No changes to update" :
                "Update role permissions"
              }
            >
              {isUpdating ? 'Updating...' : 'Update Permissions'}
            </button>
          </div>

          {responseBox.show && (
            <div className="adminUpRole-modal-overlay">
              <div className="adminUpRole-modal-box">
                <p>{responseBox.message}</p>
                <button
                  className="adminUpRole-btn adminUpRole-btn-ok"
                  onClick={() => {
                    responseBox.onOk?.();
                    setResponseBox({ show: false, message: '', onOk: null });
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}