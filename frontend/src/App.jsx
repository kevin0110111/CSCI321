import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AgentModel from './Agent/agentModel';
import AgentComment from './Agent/agentComment';
import AgentBugReport from './Agent/agentBugReport';
import AgentFAQ from './Agent/agentFAQ';
import UpdateModel from './Agent/updateModel';
import ViewComment from './Agent/viewComment';

import Login from './Login/login'

import UserUpload from './User/userUpload';

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
        <Route path="/" element={<ViewComment />} />
        <Route path="/userupload" element={<UserUpload />} />
      </Routes>
    </Router>
  );
}
