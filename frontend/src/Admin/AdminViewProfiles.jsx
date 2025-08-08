import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopBar from './AdminTopBar';
import AdminSidebar from './AdminSidebar';
import "./AdminViewProfiles.css";

const allPermissions = [
  "Update Account",
  "Manage Accounts",
  "Access Database",
  "Use System",
  "Update Models",
  "Reply Comments"
];

export default function AdminViewProfiles() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        const response = await fetch('https://fyp-backend-a0i8.onrender.com/api/roles/');
        
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        
        const rolesData = await response.json();
        
        // Transform API data to match component expectations
        const transformedRoles = rolesData.map(role => ({
          id: role.role_id,
          role: role.role_name,
          description: role.description || "",
          permissions: role.description ? role.description.split(", ").filter(p => p.trim()) : [],
          state: role.state
        }));
        
        setRoles(transformedRoles);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching roles');
        console.error('Error fetching roles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    let filtered = [...roles];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        roleItem =>
          roleItem.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          roleItem.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRoles.length > 0) {
      filtered = filtered.filter(roleItem => selectedRoles.includes(roleItem.role));
    }

    if (selectedPermissions.length > 0) {
      filtered = filtered.filter(roleItem => 
        selectedPermissions.every(perm => roleItem.permissions.includes(perm))
      );
    }

    filtered.sort((a, b) => {
      if (sortOrder === "Newest") return b.id - a.id;
      else return a.id - b.id;
    });

    setFilteredRoles(filtered);

    setSelectedFilters([...selectedRoles, ...selectedPermissions]);
  }, [searchTerm, selectedRoles, selectedPermissions, sortOrder, roles]);

  const onRoleChange = (e) => {
    const role = e.target.value;
    if (role && !selectedRoles.includes(role)) {
      setSelectedRoles(prev => [...prev, role]);
    }
    e.target.value = "";
  };

  const onPermissionChange = (e) => {
    const perm = e.target.value;
    if (perm && !selectedPermissions.includes(perm)) {
      setSelectedPermissions(prev => [...prev, perm]);
    }
    e.target.value = "";
  };

  const removeFilter = (filter) => {
    if (selectedRoles.includes(filter)) {
      setSelectedRoles(prev => prev.filter(r => r !== filter));
    } else if (selectedPermissions.includes(filter)) {
      setSelectedPermissions(prev => prev.filter(p => p !== filter));
    }
  };

  const clearFilters = () => {
    setSelectedRoles([]);
    setSelectedPermissions([]);
    setSelectedFilters([]);
    setSearchTerm("");
  };

  const goToRoleDetails = (roleId) => {
    navigate(`/admin/profile/${roleId}`);
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">

          {/* Top row */}
          <div className="admin-top-row">
            <h1 className="admin-page-title">Profile</h1>
            <input
              type="search"
              placeholder="Search roles..."
              className="admin-search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter + Sort Row */}
          <div className="admin-filter-sort-row">
            <div className="admin-filters-left">
              <label className="admin-filter-label" htmlFor="permission-filter">Filter by Permission:</label>
              <select
                id="permission-filter"
                className="admin-filter-select"
                onChange={onPermissionChange}
                defaultValue=""
              >
                <option value="" disabled hidden>Permission level</option>
                {allPermissions.map(perm => (
                  <option key={perm} value={perm}>{perm}</option>
                ))}
              </select>

              <label className="admin-filter-label" htmlFor="role-filter" style={{ marginLeft: '20px' }}>Filter by Role:</label>
              <select
                id="role-filter"
                className="admin-filter-select"
                onChange={onRoleChange}
                defaultValue=""
              >
                <option value="" disabled hidden>Role</option>
                {roles.map(roleItem => (
                  <option key={roleItem.id} value={roleItem.role}>{roleItem.role}</option>
                ))}
              </select>

              <button className="admin-all-filters" onClick={clearFilters}>
                Clear all filters
              </button>
            </div>

            <div className="admin-sort-right">
              <label htmlFor="sort-select" className="admin-filter-label">Sort:</label>
              <select
                id="sort-select"
                className="admin-sort-select"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
              </select>

              <button
                className={`admin-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                📋
              </button>
              <button
                className={`admin-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                📁
              </button>
            </div>
          </div>

          {/* Selected filter tags */}
          <div className="admin-selected-filters">
            <div className="admin-filters-left">
              {selectedFilters.map(filter => {
                const rolesList = roles.map(r => r.role);
                const permissionsList = allPermissions;

                const isRole = rolesList.includes(filter);
                const isPermission = permissionsList.includes(filter);

                // For roles, use role-xxx class; for permissions, use permission-filter-tag
                // For selected permission filter, add 'selected' class for black background
                const tagClass = isRole
                  ? `role-${filter.toLowerCase().replace(/\s+/g, '-')}`
                  : "permission-filter-tag selected";
                return (
                  <div
                    key={filter}
                    className={`admin-filter-tag ${tagClass}`}
                    onClick={() => removeFilter(filter)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Remove filter ${filter}`}
                    onKeyPress={e => e.key === "Enter" && removeFilter(filter)}
                  >
                    {filter} ×
                  </div>
                );
              })}
            </div>
            <div className="admin-results-info">
              Showing {filteredRoles.length} results
            </div>
          </div>

          {/* Roles list */}
          <div className={`admin-profile-list ${viewMode}`}>
            {filteredRoles.map(roleItem => (
              <div
                className="admin-profile-item"
                key={roleItem.id}
                onClick={() => goToRoleDetails(roleItem.id)}
                tabIndex={0}
                role="button"
                onKeyPress={e => e.key === "Enter" && goToRoleDetails(roleItem.id)}
              >
                <div className="admin-profile-info">
                  <span className={`admin-profile-role role-${roleItem.role.toLowerCase().replace(/\s+/g, '-')}`}>
                    {roleItem.role}
                  </span>
                  <div className="admin-profile-permissions">
                    <strong>Permissions:</strong>
                    <ul>
                      {roleItem.permissions.map((perm, idx) => (
                        <li key={idx}>{perm}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="admin-profile-arrow">▶</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
