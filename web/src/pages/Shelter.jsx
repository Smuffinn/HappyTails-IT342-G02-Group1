import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import shelterService from '../services/shelterService';

export default function Shelter() {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, email, logout } = useAuth();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    shelterId: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    try {
      setLoading(true);
      const data = await shelterService.getAllShelters();
      setShelters(data);
    } catch (err) {
      setError('Failed to load shelters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await shelterService.registerStaff(registerForm);
      alert('Staff registration successful! Please login.');
      setShowRegisterModal(false);
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header Bar */}
      <header style={{ background: '#f8f4ed', padding: '18px 0', borderBottom: '1px solid #e0e4d6', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#4f8a3a' }}>Happy Tails</span>
            <span style={{ color: '#5e7263', fontSize: 13 }}>Find Your Forever Friend</span>
          </button>
          <nav style={{ display: 'flex', gap: 32, fontSize: 15, alignItems: 'center' }}>
            <button type="button" onClick={() => navigate('/discover')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Discover Pets</button>
            <button type="button" onClick={() => navigate('/quiz')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Take Quiz</button>
            <button type="button" onClick={() => navigate('/shelter')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Shelters</button>
            {isStaff ? (
              <button type="button" onClick={() => navigate('/shelter/dashboard')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Shelter Dashboard</button>
            ) : (
              <button type="button" onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#253b2f', fontWeight: 600, cursor: 'pointer' }}>Profile</button>
            )}
            {isAuthenticated ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '0.9rem', color: '#5e7263' }}>{email}</span>
                <button type="button" onClick={logout} style={{ background: 'none', border: '1px solid rgba(79, 138, 58, 0.3)', color: '#4f8a3a', fontWeight: 600, cursor: 'pointer', borderRadius: 999, padding: '8px 18px' }}>Logout</button>
              </div>
            ) : (
              <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#4f8a3a', fontWeight: 600, cursor: 'pointer' }}>Login</button>
            )}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#253b2f', margin: 0 }}>Partner Shelters</h1>
          <p style={{ color: '#5e7263', margin: '8px 0', fontSize: 16 }}>Our network of trusted animal shelters</p>
        </div>

        {/* Register Staff Button */}
        {!isStaff && (
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={() => setShowRegisterModal(true)}
              style={{
                background: 'var(--color-cta)',
                color: '#fff',
                borderRadius: 999,
                fontWeight: 600,
                padding: '12px 28px',
                border: 'none',
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              Register as Shelter Staff
            </button>
          </div>
        )}

        {/* Shelters Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5e7263' }}>Loading shelters...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#d64545' }}>{error}</div>
        ) : shelters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#5e7263' }}>No shelters available at the moment.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
            {shelters.map(shelter => (
              <div
                key={shelter.shelterId}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 4px 16px rgba(84,135,104,0.08)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#253b2f', margin: 0 }}>
                  {shelter.name}
                </h3>
                <div style={{ color: '#5e7263', fontSize: 15 }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Location:</strong> {shelter.location}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Contact:</strong> {shelter.contactInfo}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Shelter ID:</strong> {shelter.shelterId}
                  </div>
                  {shelter.pets && (
                    <div>
                      <strong>Available Pets:</strong> {shelter.pets.length}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedShelter(shelter)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #4f8a3a',
                    color: '#4f8a3a',
                    borderRadius: 999,
                    fontWeight: 600,
                    padding: '8px 20px',
                    cursor: 'pointer',
                    marginTop: 'auto'
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Register Staff Modal */}
      {showRegisterModal && (
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
            borderRadius: 20,
            padding: 32,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#253b2f', margin: 0 }}>Register as Shelter Staff</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 28,
                  color: '#5e7263',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#253b2f', fontWeight: 600 }}>
                  Shelter ID *
                </label>
                <select
                  name="shelterId"
                  value={registerForm.shelterId}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #e0e4d6',
                    borderRadius: 8,
                    fontSize: 15
                  }}
                >
                  <option value="">Select a shelter</option>
                  {shelters.map(shelter => (
                    <option key={shelter.shelterId} value={shelter.shelterId}>
                      {shelter.name} (ID: {shelter.shelterId})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#253b2f', fontWeight: 600 }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
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
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#253b2f', fontWeight: 600 }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerForm.firstName}
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
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#253b2f', fontWeight: 600 }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={registerForm.lastName}
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
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#253b2f', fontWeight: 600 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={registerForm.phoneNumber}
                  onChange={handleInputChange}
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
                  onClick={() => setShowRegisterModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e0e4d6',
                    color: '#5e7263',
                    borderRadius: 999,
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
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shelter Details Modal */}
      {selectedShelter && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setSelectedShelter(null)}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: 32,
            maxWidth: 600,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#253b2f', margin: 0 }}>{selectedShelter.name}</h2>
              <button
                onClick={() => setSelectedShelter(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 28,
                  color: '#5e7263',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ color: '#5e7263', fontSize: 16, lineHeight: 1.6 }}>
              <p><strong>Location:</strong> {selectedShelter.location}</p>
              <p><strong>Contact:</strong> {selectedShelter.contactInfo}</p>
              <p><strong>Shelter ID:</strong> {selectedShelter.shelterId}</p>
              {selectedShelter.pets && selectedShelter.pets.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#253b2f', marginBottom: 12 }}>Available Pets</h3>
                  <p>{selectedShelter.pets.length} pets available for adoption</p>
                </div>
              )}
              {selectedShelter.staff && selectedShelter.staff.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#253b2f', marginBottom: 12 }}>Staff Members</h3>
                  <p>{selectedShelter.staff.length} staff members</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: '#163522', color: '#def7dd', padding: '48px 0 24px', marginTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 48, justifyContent: 'space-between', flexWrap: 'wrap', padding: '0 32px' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h4 style={{ marginBottom: 16, fontSize: 17 }}>Happy Tails</h4>
            <p style={{ color: '#b5e6c9', fontSize: 15 }}>Connecting loving families with shelter animals since 2025.</p>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <h4 style={{ marginBottom: 16, fontSize: 17 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#b5e6c9', fontSize: 15 }}>
              <li><a href="/discover" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Discover Pets</a></li>
              <li><a href="/shelter" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Shelters</a></li>
              <li><a href="/profile" style={{ color: '#b5e6c9', textDecoration: 'none' }}>Profile</a></li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: 36, textAlign: 'center', color: '#b5e6c9', fontSize: 14 }}>
          © {new Date().getFullYear()} Happy Tails. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
