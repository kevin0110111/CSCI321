import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import DetectionResultView from './User/DetectionResultView';
import UserSubscription from './User/UserSubscription';
import ReportBug from './User/ReportBug';
import LeaveComment from './User/LeaveComment';
import SwitchLanguage from './User/SwitchLanguage';
import UserComments from './User/UserComments';
import UserDashboardlayout from './User/dashboardLayout';

import FAQHelp from './User/FAQHelp';
import DiseaseReport from './User/DiseaseReport';
import DensityMap from './User/DensityMap';
import ReAnnotate from './User/ReAnnotate';
import DeleteAccount from './User/DeleteAccount';


import AdminDashboard from './Admin/AdminDashBoard';
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
        <Route path="/login" element={<Login />} />
        <Route path="/registerAccount" element={<RegisterAccount />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        <Route path="/agentComment" element={<AgentComment />} />
        <Route path="/agentBugReport" element={<AgentBugReport />} />
        <Route path="/agentFAQ" element={<AgentFAQ />} />
        <Route path="/viewComment/:comment_id" element={<ViewComment />} />
        <Route path="/viewBugReport/:bug_id" element={<ViewBugReport />} />
        <Route path="/viewFAQ" element={<ViewFAQ />} />
        <Route path="/updateAgentAccount" element={<UpdateAgentAccount />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/user" element={<UserDashboardlayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="upload" element={<UserUpload />} />
          <Route path="updateUserAccount" element={<UpdateUserAccount />} />
          <Route path="result" element={<UserResult />} />
          <Route path="resultview" element={<DetectionResultView />} />
          <Route path="subscription" element={<UserSubscription />} />
          <Route path="reportBug" element={<ReportBug />} />
          <Route path="leaveComment" element={<LeaveComment />} />
          <Route path="switchLanguage" element={<SwitchLanguage />} />
          <Route path="comments" element={<UserComments />} />
          
          <Route path="faq" element={<FAQHelp />} />                
          <Route path="diseasereport" element={<DiseaseReport />} />
          <Route path="densitymap" element={<DensityMap />} />           
          <Route path="deleteAccount" element={<DeleteAccount />} />
          <Route path="/user/reannotate" element={<ReAnnotate />} />

        </Route>

        //Admin pages
        <Route path="/admin/home" element={<AdminDashboard />} />
        <Route path="/admin/create-account" element={<AdminCreateAccount />} />
        <Route path="/admin/view-accounts" element={<AdminViewAccounts />} />
        <Route path="/admin/user/:userId" element={<AdminAccountDetails />} />
        <Route path="/admin/suspend-user/:userId" element={<AdminSuspendUser />} />
        <Route path="/admin/update-user/:userId" element={<AdminUpdateAccountDetails />} />
        <Route path="/admin/create-profile" element={<AdminCreateProfile />} />
        <Route path="/admin/view-profiles" element={<AdminViewProfiles />} />
        <Route path="/admin/profile/:roleId" element={<AdminProfileDetails />} />
        <Route path="/admin/update-profile/:roleId" element={<AdminUpdateProfileDetails />} />
        <Route path="/admin/view-models" element={<AdminViewModels />} />
        <Route path="/admin/update-model" element={<AdminUpdateModel />} />
        <Route path="/admin/model/:modelId" element={<AdminDeleteModel />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}
