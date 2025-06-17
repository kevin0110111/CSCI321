import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AgentModel from './Agent/agentModel';
import AgentComment from './Agent/agentComment';
import AgentBugReport from './Agent/agentBugReport';
import AgentFAQ from './Agent/agentFAQ';
import UpdateModel from './Agent/updateModel';
import ViewComment from './Agent/viewComment';
import ViewBugReport from './Agent/viewBugReport';
import ViewFAQ from './Agent/viewFAQ';
import UpdateAgentAccount from './Agent/updateAgentAccount';

import Login from './Login/login'

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





export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/agentModel" element={<AgentModel />} />
        <Route path="/agentComment" element={<AgentComment />} />
        <Route path="/agentBugReport" element={<AgentBugReport />} />
        <Route path="/agentFAQ" element={<AgentFAQ />} />
        <Route path="/updateModel" element={<UpdateModel />} />
        <Route path="/viewComment" element={<ViewComment />} />
        <Route path="/viewBugReport" element={<ViewBugReport />} />
        <Route path="/viewFAQ" element={<ViewFAQ />} />
        <Route path="/updateAgentAccount" element={<UpdateAgentAccount />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/userupload" element={<UserUpload />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/updateUserAccount" element={<UpdateUserAccount />} />
        <Route path="/userResult" element={<UserResult />} />
        <Route path="/user/resultview" element={<DetectionResultView />} />
        <Route path="/userSubscription" element={<UserSubscription />} />
        <Route path="/reportBug" element={<ReportBug />} />
        <Route path="/leaveComment" element={<LeaveComment />} />
        <Route path="/switchLanguage" element={<SwitchLanguage />} />
        <Route path="/userComments" element={<UserComments />} />
      </Routes>
    </Router>
  );
}
