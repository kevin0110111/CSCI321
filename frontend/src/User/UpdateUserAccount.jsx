// UpdateUserAccount.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpdateUserAccount() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    dob: '',
    email: '',
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

  const [currentAccountId, setCurrentAccountId] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [fetchError, setFetchError] = useState(null); 
  const [responseBox, setResponseBox] = useState({ show: false, message: '' }); 


  const formatDob = (dob) => {
    if (!dob) return '';
    try {
      const date = new Date(dob);
      if (isNaN(date.getTime())) return ''; 
      return date.toLocaleDateString('en-GB').split('/').join('-');
    } catch (error) {
      console.error('DOB format error:', error);
      return '';
    }
  };

  useEffect(() => {

    const storedAccountId = localStorage.getItem('accountId');
    const storedAccountString = localStorage.getItem('account');

    console.log('Stored accountId:', storedAccountId); 
    console.log('Stored account string:', storedAccountString); 

    if (storedAccountId) {
      setCurrentAccountId(parseInt(storedAccountId, 10));
    }

    let storedAccount = null;
    if (storedAccountString) {
      try {
        storedAccount = JSON.parse(storedAccountString);
        console.log('Parsed storedAccount:', storedAccount); 
        if (storedAccount && storedAccount.profile && storedAccount.profile.profile_id) {
          setCurrentProfileId(storedAccount.profile.profile_id);

          setFormData(prev => ({
            ...prev,
            username: storedAccount.username || '',
            email: storedAccount.email || '',
            name: storedAccount.profile.name || '',
            dob: formatDob(storedAccount.profile.dob) || '',
          }));
        } else {
          console.warn('Stored account missing profile or profile_id');
        }
      } catch (error) {
        console.error('Failed to parse account data from localStorage:', error);
        setResponseBox({ show: true, message: 'Failed to load stored account data!' });
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchAccountAndProfile = async () => {
      if (!currentAccountId || !currentProfileId) {
        console.warn('Missing accountId or profileId, skipping fetch');
        setFetchError('Missing account or profile ID. Please log in again.');
        return;
      }

      setIsLoading(true);
      setFetchError(null);
      try {
        const token = localStorage.getItem('token'); 
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}), 
        };

        const accountResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${currentAccountId}`, { headers });
        if (!accountResponse.ok) {
          throw new Error(`Account fetch failed: ${accountResponse.status}`);
        }
        const accountData = await accountResponse.json();

        const profileResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/profiles/${currentProfileId}`, { headers });
        if (!profileResponse.ok) {
          throw new Error(`Profile fetch failed: ${profileResponse.status}`);
        }
        const profileData = await profileResponse.json();

        console.log('Fetched accountData:', accountData); 
        console.log('Fetched profileData:', profileData); 

        setFormData(prev => ({
          ...prev,
          username: accountData.username || '',
          email: accountData.email || '',
          name: profileData.name || '',
          dob: formatDob(profileData.dob) || '',
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError(`Failed to fetch data: ${error.message}. Check network or authentication.`);
        setResponseBox({ show: true, message: 'An error occurred while fetching data!' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountAndProfile();
  }, [currentAccountId, currentProfileId]);

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

  const handleSave = async () => {
    if (!currentAccountId || !currentProfileId) {
      setResponseBox({ show: true, message: 'Account ID not available, please login again!' });
      return;
    }

    // 密码变更逻辑
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setResponseBox({ show: true, message: 'Please enter your current password to change it.' });
        return;
      }
      if (!passwordValidations.length || !passwordValidations.number || !passwordValidations.uppercase || !passwordValidations.specialChar || !passwordValidations.lowercase) {
        setResponseBox({ show: true, message: 'New password does not meet all requirements!' });
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };

        const passwordChangePayload = {
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        };

        const passwordResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${currentAccountId}/change-password`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(passwordChangePayload),
        });

        const passwordData = await passwordResponse.json();

        if (!passwordResponse.ok) {
          setResponseBox({
            show: true,
            message: `Failed to change password: ${passwordData.detail || 'Something went wrong.'}`
          });
          return;
        } else {
          setResponseBox({ show: true, message: 'Password changed successfully!' });
          setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        }
      } catch (error) {
        console.error('Error changing password:', error);
        setResponseBox({ show: true, message: 'An error occurred during password change. Please try again.' });
        return;
      }
    }

    // 更新 account 和 profile
    const accountUpdatePayload = {
      username: formData.username,
      email: formData.email,
    };

    let formattedDob = '';
    if (formData.dob) {
      const [day, month, year] = formData.dob.split('-').map(Number);
      formattedDob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    const profileUpdatePayload = {
      name: formData.name,
      dob: formattedDob || null, // 允许 null
    };

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      };

      const accountResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${currentAccountId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(accountUpdatePayload),
      });

      const profileResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/profiles/${currentProfileId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileUpdatePayload),
      });

      if (accountResponse.ok && profileResponse.ok) {
        setResponseBox({ show: true, message: 'Account and profile details updated successfully!' });
        setIsEditing(false);
        // 更新 localStorage 以保持一致
        const updatedAccount = JSON.parse(localStorage.getItem('account') || '{}');
        updatedAccount.username = formData.username;
        updatedAccount.email = formData.email;
        updatedAccount.profile.name = formData.name;
        updatedAccount.profile.dob = formattedDob;
        localStorage.setItem('account', JSON.stringify(updatedAccount));
      } else {
        const accountError = await accountResponse.json();
        const profileError = await profileResponse.json();
        setResponseBox({
          show: true,
          message: `Failed to update: Account - ${accountError.detail || 'Error'}, Profile - ${profileError.detail || 'Error'}`
        });
      }
    } catch (error) {
      console.error('Error updating data:', error);
      setResponseBox({ show: true, message: 'An error occurred during update. Please try again.' });
    }
  };

  const closeResponseBox = () => {
    setResponseBox({ show: false, message: '' });
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

          {isLoading ? (
            <p>Loading account data...</p>
          ) : (
            <>
              {fetchError && <p style={{ color: 'red', marginBottom: '1rem' }}>{fetchError}</p>}
              <div className="form-field">
                <label>User name</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>Date of birth</label>
                <input type="text" name="dob" placeholder="DD-MM-YYYY" value={formData.dob} onChange={handleInputChange} readOnly={!isEditing} />
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
            </>
          )}

          {responseBox.show && (
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '1rem', border: '1px solid #ccc', zIndex: 1000 }}>
              <p>{responseBox.message}</p>
              <button onClick={closeResponseBox}>OK</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}