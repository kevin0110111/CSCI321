import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentDashboard from './Agent/agentDashboard';
import Login from './Login/login'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/agentDashboard" element={<AgentDashboard />} />
      </Routes>
    </Router>
  );
}
