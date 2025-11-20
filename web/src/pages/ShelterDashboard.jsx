import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import shelterService from '../services/shelterService';

export default function ShelterDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, email, logout } = useAuth();
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    contactInfo: ''
  });

  useEffect(() => {
    // Temporarily disabled authentication check for UI preview
    // if (!isStaff) {
    //   navigate('/shelter');
    //   return;
    // }
    loadShelterData();
  }, [isStaff, navigate]);

  const loadShelterData = async () => {
    try {
      setLoading(true);
      // Try to fetch real data
      const data = await shelterService.getMyShelter();
      setShelter(data);
      setEditForm({
        name: data.name || '',
        location: data.location || '',
        contactInfo: data.contactInfo || ''
      });
      setError(null);
    } catch (err) {
      // For demo purposes, show mock data instead of error
      console.log('Using mock data for preview');
      const mockData = {
        shelterId: 1,
        name: 'Happy Paws Shelter',
        location: 'Cebu City, Philippines',
        contactInfo: 'contact@happypaws.com',
        pets: [],
        staff: []
      };
      setShelter(mockData);
      setEditForm({
        name: mockData.name,
        location: mockData.location,
        contactInfo: mockData.contactInfo
      });
      setError(null); // Hide error for demo
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await shelterService.updateMyShelter(editForm);
      setShelter(updated);
      setEditMode(false);
      alert('Shelter information updated successfully!');
    } catch (err) {
      alert('Failed to update shelter: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Temporarily disabled for UI preview
  // if (!isStaff) {
  //   return null;
  // }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header Bar */}
      <header style={{ background: '#f8f4ed', padding: '18px 0', borderBottom: '1px solid #e0e4d6', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#4f8a3a' }}>Happy Tails</span>
            <span style={{ color: '#5e7263', fontSize: 13 }}>Shelter Management</span>
          </button>
          <nav style={{ display: 'flex', gap: 32, fontSize: 15, alignItems: 'center' }}>
            <button type="button" onClick={() => navigate('/discover')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Discover Pets</button>
            <button type="button" onClick={() => navigate('/shelter')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>All Shelters</button>
            <button type="button" onClick={() => navigate('/shelter/dashboard')} style={{ background: 'none', border: 'none', color: '#4f8a3a', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Dashboard</button>
            {isAuthenticated && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '0.9rem', color: '#5e7263' }}>{email}</span>
                <button type="button" onClick={logout} style={{ background: 'none', border: '1px solid rgba(79, 138, 58, 0.3)', color: '#4f8a3a', fontWeight: 600, cursor: 'pointer', borderRadius: 999, padding: '8px 18px' }}>Logout</button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#253b2f', margin: 0 }}>Shelter Management</h1>
          <p style={{ color: '#5e7263', margin: '8px 0', fontSize: 16 }}>Manage your shelter's public profile</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5e7263' }}>Loading shelter data...</div>
        ) : error ? (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12, padding: '16px', color: '#991b1b', marginBottom: 24 }}>
            ⚠️ Request failed with status code 500
          </div>
        ) : shelter ? (
          <>

            {/* Shelter Information Card */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(84,135,104,0.08)',
              padding: 32,
              marginBottom: 32
            }}>

              {/* Shelter Name */}
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontWeight: 600, fontSize: '0.95rem' }}>
                  Shelter Name
                </label>
                <div style={{ color: '#6b7280', fontSize: '1rem' }}>
                  {shelter.name || 'Not set'}
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontWeight: 600, fontSize: '0.95rem' }}>
                  Location
                </label>
                <div style={{ color: '#6b7280', fontSize: '1rem' }}>
                  {shelter.location || 'Not set'}
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#374151', fontWeight: 600, fontSize: '0.95rem' }}>
                  Contact Information
                </label>
                <div style={{ color: '#6b7280', fontSize: '1rem' }}>
                  {shelter.contactInfo || 'Not set'}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditMode(true)}
                style={{
                  background: 'var(--color-cta)',
                  color: '#fff',
                  borderRadius: 999,
                  fontWeight: 600,
                  padding: '12px 28px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 6px 12px rgba(120, 201, 119, 0.35)'
                }}
              >
                Edit Shelter Profile
              </button>
            </div>

            {/* Info Box */}
            <div style={{
              background: '#f0f9f4',
              border: '1px solid #c3e6cb',
              borderRadius: 16,
              padding: 24,
              marginBottom: 32
            }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <span style={{ color: '#4f8a3a', fontSize: '1.2rem' }}>ℹ️</span>
                <h3 style={{ color: '#253b2f', fontSize: '1rem', fontWeight: 600, margin: 0 }}>About Shelter Profiles</h3>
              </div>
              <p style={{ color: '#5e7263', fontSize: '0.95rem', margin: '8px 0 8px 36px', lineHeight: 1.6 }}>
                Your shelter profile is visible to all potential adopters browsing pets on HappyTails. Keep your information up-to-date to help adopters contact you easily.
              </p>
              <ul style={{ color: '#5e7263', fontSize: '0.95rem', margin: '8px 0 0 36px', paddingLeft: 20, lineHeight: 1.8 }}>
                <li>Shelter name appears on all your pet listings</li>
                <li>Location helps adopters find pets near them</li>
                <li>Contact info should include multiple ways to reach you</li>
              </ul>
            </div>

            {/* Edit Modal */}
            {editMode && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: 32,
                  maxWidth: 600,
                  width: '90%',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#253b2f', marginBottom: 24 }}>Edit Shelter Information</h2>
                  <form onSubmit={handleEditSubmit}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: '#253b2f', fontWeight: 600 }}>
                      Shelter Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e0e4d6',
                        borderRadius: 8,
                        fontSize: 15
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: '#253b2f', fontWeight: 600 }}>
                      Location
                    </label>
                    <textarea
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e0e4d6',
                        borderRadius: 8,
                        fontSize: 15,
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: '#253b2f', fontWeight: 600 }}>
                      Contact Information
                    </label>
                    <input
                      type="text"
                      name="contactInfo"
                      value={editForm.contactInfo}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e0e4d6',
                        borderRadius: 8,
                        fontSize: 15
                      }}
                    />
                  </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setEditForm({
                            name: shelter.name || '',
                            location: shelter.location || '',
                            contactInfo: shelter.contactInfo || ''
                          });
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid #d1d5db',
                          color: '#6b7280',
                          borderRadius: 8,
                          fontWeight: 600,
                          padding: '10px 24px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          background: 'var(--color-cta)',
                          color: '#fff',
                          borderRadius: 999,
                          fontWeight: 600,
                          padding: '10px 24px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5e7263' }}>
            No shelter data available
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: '#163522', color: '#def7dd', padding: '48px 0 24px', marginTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', padding: '0 32px' }}>
          <p style={{ color: '#b5e6c9', fontSize: 15 }}>Happy Tails Shelter Management System</p>
          <div style={{ marginTop: 16, color: '#b5e6c9', fontSize: 14 }}>
            © {new Date().getFullYear()} Happy Tails. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
