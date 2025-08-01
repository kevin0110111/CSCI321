import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminTopBar from './AdminTopBar';
import AdminSidebar from './AdminSidebar';
import "./AdminViewAccounts.css";

const allUsers = [
  { id: 1, name: "Leslie Alexander", email: "leslie.alexander@example.com", role: "Admin" },
  { id: 2, name: "Dries Vincent", email: "dries.vincent@example.com", role: "User" },
  { id: 3, name: "Michael Foster", email: "michael.foster@example.com", role: "Agent" },
  { id: 4, name: "Lindsay Walton", email: "lindsay.walton@example.com", role: "Admin" },
  { id: 5, name: "Courtney Henry", email: "courtney.henry@example.com", role: "Agent" },
  { id: 6, name: "Tom Cook", email: "tom.cook@example.com", role: "Premium User" }
];

export default function AdminViewAccounts() {
  const navigate = useNavigate();

  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [selectedName, setSelectedName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Filter users on search, selectedName, selectedRoles, sortOrder
  useEffect(() => {
    let filtered = [...allUsers];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedName) {
      filtered = filtered.filter(user => user.name === selectedName);
    }

    if (selectedRoles.length > 0) {
      filtered = filtered.filter(user => selectedRoles.includes(user.role));
    }

    filtered.sort((a, b) => {
      if (sortOrder === "Newest") return b.id - a.id;
      else return a.id - b.id;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, selectedName, selectedRoles, sortOrder]);

  // Update selected filter tags
  useEffect(() => {
    const filters = [];
    if (selectedName) filters.push(selectedName);
    filters.push(...selectedRoles);
    setSelectedFilters(filters);
  }, [selectedName, selectedRoles]);

  // Remove tag handler
  const removeFilter = (filter) => {
    if (filter === selectedName) {
      setSelectedName("");
    } else {
      setSelectedRoles(prev => prev.filter(role => role !== filter));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters([]);
    setSelectedName("");
    setSelectedRoles([]);
    setSearchTerm("");
  };

  // On Role select change: add to selectedRoles array, then reset dropdown value
  const onRoleChange = (e) => {
    const role = e.target.value;
    if (role && !selectedRoles.includes(role)) {
      setSelectedRoles(prev => [...prev, role]);
    }
    e.target.value = ""; // reset dropdown so user can add more roles
  };

  const goToUserDetails = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const uniqueNames = Array.from(new Set(filteredUsers.map(u => u.name)));

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          {/* A */}
          <div className="admin-top-row">
            <h1 className="admin-page-title">Accounts</h1>
            <input
              type="search"
              placeholder="Search users..."
              className="admin-search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* B */}
          <div className="admin-filter-sort-row">
            <div className="admin-filters-left">
              <label className="admin-filter-label">Filter:</label>

              <select
                className="admin-filter-select"
                value={selectedName}
                onChange={e => setSelectedName(e.target.value)}
              >
                <option value="" disabled hidden>Name</option>
                {uniqueNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>

              <select
                className="admin-filter-select"
                onChange={onRoleChange}
                defaultValue=""
              >
                <option value="" disabled hidden>Role</option>
                <option value="Agent">Agent</option>
                <option value="User">User</option>
                <option value="Premium User">Premium User</option>
                <option value="Admin">Admin</option>
              </select>

              <button className="admin-filter-icon" aria-label="Filter icon">⚙️</button>
              <button className="admin-all-filters" onClick={clearFilters}>All Filters</button>
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

          {/* C */}
          <div className="admin-selected-filters">
            <div className="left">
              {selectedFilters.map(filter => {
                // Determine if filter is a role or a name
                const roleColors = {
                  admin: "role-admin",
                  agent: "role-agent",
                  user: "role-user",
                  "premium user": "role-premium-user",
                };

                // Check if filter is a role (case insensitive match)
                const filterLower = filter.toLowerCase();
                const isRole = Object.keys(roleColors).includes(filterLower);

                // Compose className accordingly
                const tagClass = isRole ? roleColors[filterLower] : "name-filter-tag";

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
              {selectedFilters.length > 0 && (
                <button className="admin-clear-filters" onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>
            <div className="admin-account-filter-results-info">
              Showing {filteredUsers.length} results
            </div>
          </div>

          {/* D */}
          <div className={`admin-user-list ${viewMode}`}>
            {filteredUsers.map(user => (
              <div
                className="admin-user-item"
                key={user.id}
                onClick={() => goToUserDetails(user.id)}
                tabIndex={0}
                role="button"
                onKeyPress={e => e.key === "Enter" && goToUserDetails(user.id)}
              >
                <div className="admin-user-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <div className={`admin-user-role role-${user.role.toLowerCase().replace(/\s+/g, '-')}`}>
                  {user.role}
                </div>
                <div className="admin-user-arrow">▶</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
