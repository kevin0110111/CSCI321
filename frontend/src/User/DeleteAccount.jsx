// DeleteAccount.jsx
import React, { useState } from 'react';
import './DeleteAccount.css';

const DeleteAccount = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [input, setInput] = useState('');

  const handleDelete = (e) => {
    e.preventDefault();
    if (input === 'DELETE') {
      setConfirmed(true);
    } else {
      alert('Please type DELETE to confirm.');
    }
  };

  return (
    <div className="delete-layout">
      
      <main className="delete-main">
        <h1>Delete Account</h1>
        <p className="delete-warning">
          Warning: This action will permanently delete your account and all associated data. This cannot be undone.
        </p>
        <form onSubmit={handleDelete} className="delete-form">
          <label htmlFor="confirmDelete">Type <strong>DELETE</strong> to confirm:</label>
          <input
            type="text"
            id="confirmDelete"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button type="submit" className="delete-btn">Delete My Account</button>
        </form>
        {confirmed && <p className="delete-success">Your account has been deleted.</p>}
      </main>
    </div>
  );
};

export default DeleteAccount;
