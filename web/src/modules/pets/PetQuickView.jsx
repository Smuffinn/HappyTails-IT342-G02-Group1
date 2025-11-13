import React from 'react';

/**
 * PetQuickView
 * Props: { pet, onClose }
 * Shows a modal or card with pet details and an Apply button.
 */
export default function PetQuickView({ pet, onClose }) {
  if (!pet) return null;
  // Dummy data for missing fields (energy, shelter, about, etc)
  const energy = pet.energy || 'High';
  const shelter = pet.shelter || 'Happy Paws Rescue';
  const about = pet.about || `
    ${pet.name} is a sweet and energetic ${pet.breed} who loves people and playing fetch. She would do great in an active family with a yard.`;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.24)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 24, maxWidth: 680, width: '100%', padding: 0, boxShadow: '0 12px 32px rgba(84,135,104,0.15)', position: 'relative', display: 'flex', minHeight: 320 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#5e7263', cursor: 'pointer', zIndex: 2 }}>&times;</button>
        {/* Left: Pet Image */}
        <div style={{ flex: 1, padding: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <img src={pet.imageUrl} alt={pet.name} style={{ width: 120, height: 120, borderRadius: 16, objectFit: 'cover', marginTop: 6 }} />
        </div>
        {/* Right: Info */}
        <div style={{ flex: 2, padding: '24px 28px 24px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#253b2f', fontWeight: 700 }}>{pet.name}</h2>
            <span style={{ color: '#5e7263', fontSize: 14, marginTop: 7 }}>{pet.breed}</span>
          </div>
          <div style={{ display: 'flex', gap: 16, margin: '16px 0 18px 0' }}>
            <div style={{ background: '#f9f6ef', borderRadius: 16, padding: '18px 22px', textAlign: 'center', minWidth: 88 }}>
              <div style={{ color: '#7ac05b', fontWeight: 700, fontSize: 22 }}>🗓️</div>
              <div style={{ fontSize: 14, color: '#5e7263', marginTop: 2 }}>Age</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{pet.age}</div>
            </div>
            <div style={{ background: '#f9f6ef', borderRadius: 16, padding: '18px 22px', textAlign: 'center', minWidth: 88 }}>
              <div style={{ color: '#7ac05b', fontWeight: 700, fontSize: 22 }}>📏</div>
              <div style={{ fontSize: 14, color: '#5e7263', marginTop: 2 }}>Size</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{pet.size?.charAt(0).toUpperCase() + pet.size?.slice(1) || 'Medium'}</div>
            </div>
            <div style={{ background: '#f9f6ef', borderRadius: 16, padding: '18px 22px', textAlign: 'center', minWidth: 88 }}>
              <div style={{ color: '#7ac05b', fontWeight: 700, fontSize: 22 }}>⚡</div>
              <div style={{ fontSize: 14, color: '#5e7263', marginTop: 2 }}>Energy</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{energy}</div>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, color: '#253b2f', fontSize: 15, marginBottom: 4 }}>Temperament</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {pet.tags?.length ? pet.tags.map(t => <span key={t} style={{ background: '#f1efe6', borderRadius: 999, padding: '7px 18px', fontWeight: 600, fontSize: 14, color: '#4f8a3a' }}>{t}</span>) : <span>No tags</span>}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, color: '#253b2f', fontSize: 15, marginBottom: 3 }}>About {pet.name}</div>
            <div style={{ color: '#5e7263', fontSize: 15, marginBottom: 0 }}>{about}</div>
          </div>
          <div style={{ background: '#f9f6ef', borderRadius: 14, padding: '13px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 22, color: '#78c977' }}>📍</span>
            <span style={{ color: '#5e7263', fontWeight: 600, fontSize: 15 }}>Located at</span>
            <span style={{ color: '#253b2f', fontWeight: 700, fontSize: 15 }}>{shelter}</span>
          </div>
          <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
            <button style={{ background: '#c1f2bb', color: '#253b2f', borderRadius: 999, fontWeight: 600, padding: '13px 32px', border: 'none', fontSize: 15, flex: 1, cursor: 'pointer' }}>Apply to Adopt</button>
            <button style={{ background: '#fff', color: '#4f8a3a', border: '1.5px solid #c1f2bb', borderRadius: 999, fontWeight: 600, padding: '13px 32px', fontSize: 15, flex: 1, cursor: 'pointer' }}>Contact Shelter</button>
          </div>
          <div style={{ background: '#f9f6ef', borderRadius: 14, padding: '14px 18px', color: '#5e7263', fontSize: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 18, marginTop: 2 }}>💡</span>
            <span><strong>Good to know:</strong> All our pets are vaccinated, spayed/neutered, and ready for adoption. Application review typically takes 1-3 business days.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
