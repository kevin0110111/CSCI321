import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AgentModel from './Agent/agentModel';
import AgentComment from './Agent/agentComment';
import AgentBugReport from './Agent/agentBugReport';
import AgentFAQ from './Agent/agentFAQ';

import Login from './Login/login'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/p" element={<AgentModel />} />
        <Route path="/pp" element={<AgentComment />} />
        <Route path="/ppp" element={<AgentBugReport />} />
        <Route path="/" element={<AgentFAQ />} />
      </Routes>
    </Router>
  );
}
