// UpdateUserAccount.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendar from '../assets/calendar.svg';

export default function UpdateUserAccount() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

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
            dob: storedAccount.profile.dob || '',
          }));
        } else {
          console.warn('Stored account missing profile or profile_id');
        }
      } catch (error) {
        console.error('Failed to parse account data from localStorage:', error);
        setResponseBox({ show: true, message: t('loadAccountFailed') });
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchAccountAndProfile = async () => {
      if (!currentAccountId || !currentProfileId) {
        console.warn('Missing accountId or profileId, skipping fetch');
        setFetchError(t('missingAccountOrProfileID'));
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
          dob: profileData.dob ? profileData.dob : '',
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchError(`Failed to fetch data: ${error.message}. Check network or authentication.`);
        setResponseBox({ show: true, message: t('fetchDataFailedMessage') });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountAndProfile();
  }, [currentAccountId, currentProfileId, t]);

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
      setResponseBox({ show: true, message: t('accountIdNotAvailable') });
      return;
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setResponseBox({ show: true, message: t('enterCurrentPassword') });
        return;
      }
      if (!passwordValidations.length || !passwordValidations.number || !passwordValidations.uppercase || !passwordValidations.specialChar || !passwordValidations.lowercase) {
        setResponseBox({ show: true, message: t('newPasswordRequirements') });
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
          setResponseBox({ show: true, message: t('passwordChangeSuccess') });
          setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        }
      } catch (error) {
        console.error('Error changing password:', error);
        setResponseBox({ show: true, message: t('passwordChangeError') });
        return;
      }
    }

    const accountUpdatePayload = {
      username: formData.username,
      email: formData.email,
    };

    const profileUpdatePayload = {
      name: formData.name,
      dob: formData.dob,
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
        setResponseBox({ show: true, message: t('updateSuccess') });
        setIsEditing(false);
        const updatedAccount = JSON.parse(localStorage.getItem('account') || '{}');
        updatedAccount.username = formData.username;
        updatedAccount.email = formData.email;
        updatedAccount.profile.name = formData.name;
        updatedAccount.profile.dob = formData.dob;
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
      setResponseBox({ show: true, message: t('updateError') });
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
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{t('updateAccount')}</h2>

          {isLoading ? (
            <p>{t('loadingAccountData')}</p>
          ) : (
            <>
              {fetchError && <p style={{ color: 'red', marginBottom: '1rem' }}>{fetchError}</p>}
              <div className="form-field">
                <label>{t('usernameLabel')}</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>{t('nameLabel')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>{t('dobLabel')}</label>
                <div className="agentdob-input-wrapper">
                  <DatePicker
                    selected={formData.dob ? new Date(formData.dob) : null}
                    onChange={(date) => {
                      const isoDate = date ? date.toISOString().split('T')[0] : '';
                      setFormData(prev => ({
                        ...prev,
                        dob: isoDate
                      }));
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Date of birth"
                    className="agentdate-picker-input"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    id="dob-datepicker"
                    readOnly={!isEditing}
                  />
                  <img
                    src={calendar}
                    alt="Calendar"
                    className="calendar-icon"
                    onClick={() => isEditing && document.getElementById('dob-datepicker')?.focus()}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>{t('emailLabel')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>{t('currentPasswordLabel')}</label>
                <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} readOnly={!isEditing} />
              </div>

              <div className="form-field">
                <label>{t('newPasswordLabel')}</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} readOnly={!isEditing} />
                <div className="password-requirements">
                  <p className={passwordValidations.length ? 'valid' : 'invalid'}>• {t('passwordLength')}</p>
                  <p className={passwordValidations.number ? 'valid' : 'invalid'}>• {t('passwordNumber')}</p>
                  <p className={passwordValidations.uppercase ? 'valid' : 'invalid'}>• {t('passwordUppercase')}</p>
                  <p className={passwordValidations.specialChar ? 'valid' : 'invalid'}>• {t('passwordSpecialChar')}</p>
                  <p className={passwordValidations.lowercase ? 'valid' : 'invalid'}>• {t('passwordLowercase')}</p>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="edit-btn" onClick={() => setIsEditing(true)} disabled={isEditing}>{t('edit')}</button>
                <button className="save-btn" onClick={handleSave} disabled={!isEditing}>{t('save')}</button>
                <button className="back-btn" onClick={() => navigate(-1)}>{t('back')}</button>
              </div>
            </>
          )}

          {responseBox.show && (
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '1rem', border: '1px solid #ccc', zIndex: 1000 }}>
              <p>{responseBox.message}</p>
              <button onClick={closeResponseBox}>{t('ok')}</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}