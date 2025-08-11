import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // If using for nested routes

export default function ProtectedRoute({ allowedRoles, children }) {
  const isAuthenticated = localStorage.getItem('authToken') === 'authenticated';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const storedRole = localStorage.getItem('role');
  const role = storedRole ? JSON.parse(storedRole).role_name.toLowerCase() : null;

  if (!role || !allowedRoles.includes(role)) {
    // Redirect to role-specific home if wrong role
    let homePath = '/login'; // Default
    if (role === 'user') homePath = '/user/dashboard';
    else if (role === 'agent') homePath = '/agentComment';
    else if (role === 'admin') homePath = '/admin/view-accounts';
    return <Navigate to={homePath} replace />;
  }

  // If nested routes (e.g., /user/*), use Outlet; otherwise, render children
  return children ? children : <Outlet />;
}