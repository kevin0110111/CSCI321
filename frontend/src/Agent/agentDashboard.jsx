import './agentDashboard.css';
import model from '../assets/model.svg';
import comment from '../assets/comment.svg'
import reportBug from '../assets/bug.svg'
import faq from '../assets/faq.svg'
import logout from '../assets/logout.svg'

export default function AgentDashboard() {
  const cards = [
    { title: "Open Tickets", value: 12 },
    { title: "Pending", value: 7 },
    { title: "Resolved", value: 34 },
    { title: "Avg. Response Time", value: "2h 15m" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Agent Portal</div>
        <nav>
          <a href="#" className="nav-link active"><img src={model} alt="Model" className="icon"/>  Model</a>
          <a href="#" className="nav-link"><img src={comment} alt="Comment" className="icon"/>  Comment</a>
          <a href="#" className="nav-link"><img src={reportBug} alt="ReportedBug" className="icon"/>  Reported Bug</a>
          <a href="#" className="nav-link"><img src={faq} alt="FAQ" className="icon"/>  FAQ</a>
          <a href="#" className="nav-link"><img src={logout} alt="Logout" className="icon"/>  Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-section">
        {/* Header */}
        <header className="header">
          <h1>Dashboard</h1>
          <div className="profile">
            <span>Welcome, Agent</span>
          </div>
        </header>

        {/* Cards */}
        <main className="cards">
          {cards.map((card, idx) => (
            <div key={idx} className="card">
              <h2>{card.title}</h2>
              <p>{card.value}</p>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
