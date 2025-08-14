import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Login/ProtectedRoute';

import AgentComment from './Agent/agentComment';
import AgentBugReport from './Agent/agentBugReport';
import AgentFAQ from './Agent/agentFAQ';
import ViewComment from './Agent/viewComment';
import ViewBugReport from './Agent/viewBugReport';
import ViewFAQ from './Agent/viewFAQ';
import UpdateAgentAccount from './Agent/updateAgentAccount';

import Login from './Login/login'
import RegisterAccount from './Login/registerAccount';
import ForgotPassword from './Login/forgotPassword';

import UserUpload from './User/userUpload';
import UserDashboard from './User/UserDashboard';
import UpdateUserAccount from './User/UpdateUserAccount';
import UserResult from './User/UserResult';
import UserSubscription from './User/UserSubscription';
import ReportBug from './User/ReportBug';
import LeaveComment from './User/LeaveComment';
import SwitchLanguage from './User/SwitchLanguage';
import UserComments from './User/UserComments';
import UserDashboardlayout from './User/dashboardLayout';
import CommentReply from './User/CommentReply';
import FAQHelp from './User/FAQHelp';



import AdminDashBoard from './Admin/AdminDashBoard';
import AdminCreateAccount from './Admin/AdminCreateAccount';
import AdminViewAccounts from './Admin/AdminViewAccounts';
import AdminAccountDetails from './Admin/AdminAccountDetails';
import AdminSuspendUser from './Admin/AdminSuspendUser';
import AdminUpdateAccountDetails from './Admin/AdminUpdateAccountDetails';
import AdminCreateProfile from './Admin/AdminCreateProfile';
import AdminViewProfiles from './Admin/AdminViewProfiles';
import AdminProfileDetails from "./Admin/AdminProfileDetails";
import AdminUpdateProfileDetails from './Admin/AdminUpdateProfileDetails';
import AdminViewModels from './Admin/AdminViewModels';
import AdminUpdateModel from './Admin/AdminUpdateModel';
import AdminDeleteModel from './Admin/AdminDeleteModel';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - no protection */}
        <Route path="/login" element={<Login />} />
        <Route path="/registerAccount" element={<RegisterAccount />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Agent routes - protected for 'agent' role */}
        <Route
          path="/agentComment"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentComment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agentBugReport"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentBugReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agentFAQ"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentFAQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewComment/:comment_id"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <ViewComment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewBugReport/:bug_id"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <ViewBugReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewFAQ"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <ViewFAQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateAgentAccount"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <UpdateAgentAccount />
            </ProtectedRoute>
          }
        />

        {/* User routes - nested and protected for 'user' role */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboardlayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="upload" element={<UserUpload />} />
          <Route path="updateUserAccount" element={<UpdateUserAccount />} />
          <Route path="result" element={<UserResult />} />
          <Route path="subscription" element={<UserSubscription />} />
          <Route path="ReportBug" element={<ReportBug />} />
          <Route path="leaveComment" element={<LeaveComment />} />
          <Route path="comments/:comment_id" element={<CommentReply />} />
          <Route path="switchLanguage" element={<SwitchLanguage />} />
          <Route path="comments" element={<UserComments />} />
          <Route path="faq" element={<FAQHelp />} />
        </Route>

        {/* Admin routes - protected for 'admin' role */}
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-account"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCreateAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-accounts"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminViewAccounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:userId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAccountDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/suspend-user/:userId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSuspendUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update-user/:userId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUpdateAccountDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCreateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-profiles"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminViewProfiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile/:roleId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfileDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update-profile/:roleId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUpdateProfileDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-models"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminViewModels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update-model"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUpdateModel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/model/:modelId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDeleteModel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
