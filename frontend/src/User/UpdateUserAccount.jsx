// UpdateUserAccount.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpdateUserAccount() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);


  const [formData, setFormData] = useState({
    username: 'user001',
    name: 'John Doe',
    dob: '2000-01-01',
    email: 'user001@example.com',
    currentPassword: '',
    newPassword: ''
  });

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    number: false,
    uppercase: false,
    specialChar: false,
    lowercase: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      setPasswordValidations({
        length: value.length >= 8,
        number: /\d/.test(value),
        uppercase: /[A-Z]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        lowercase: /[a-z]/.test(value),
      });
    }
  };

  const handleSave = () => {
    console.log('User updated:', formData);
    setIsEditing(false);
  };

  useEffect(() => {
    document.title = 'Update';
  }, []);

  return (
        <main className="dashboard-content">
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem 0',
            minHeight: 'calc(100vh - 80px)',
          }}>
            <div className="account-form" style={{
              maxWidth: '600px',
              background: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              width: '100%',
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Update Account</h2>

              <div className="form-field">
                <label>User name</label>
                <input type="text" value={formData.username} readOnly />
              </div>

              <div className="form-field">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>Date of birth</label>
                <input type="text" name="dob" value={formData.dob} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>Current password</label>
                <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>New password</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} readOnly={!isEditing} />
                <div className="password-requirements">
                  <p className={passwordValidations.length ? 'valid' : 'invalid'}>• At least 8 characters</p>
                  <p className={passwordValidations.number ? 'valid' : 'invalid'}>• One number</p>
                  <p className={passwordValidations.uppercase ? 'valid' : 'invalid'}>• One uppercase letter</p>
                  <p className={passwordValidations.specialChar ? 'valid' : 'invalid'}>• One special character</p>
                  <p className={passwordValidations.lowercase ? 'valid' : 'invalid'}>• One lowercase letter</p>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="edit-btn" onClick={() => setIsEditing(true)} disabled={isEditing}>Edit</button>
                <button className="save-btn" onClick={handleSave} disabled={!isEditing}>Save</button>
                <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
              </div>
            </div>
          </div>
        </main>
  );
}
