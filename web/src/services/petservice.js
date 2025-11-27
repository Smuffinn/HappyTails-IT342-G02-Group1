import api from './api';

// This file contains functions that call specific backend endpoints

const extractMessage = (err) => {
  const payload = err?.response?.data
  if (payload) {
    if (typeof payload === 'string') return payload
    if (payload.error) return payload.error
    if (payload.message) return payload.message
  }
  return err?.message || String(err)
}

export const petService = {
  /**
   * Fetches all pets from the backend
   * Corresponds to GET /api/pets
   */
  getAllPets: async () => {
    try {
      const response = await api.get('/pets');
      // Normalize backend pet shape to UI-friendly object
      const raw = response.data;
      if (!Array.isArray(raw)) {
        return [];
      }
      return raw.map((p) => {
        const shelterId = p.shelterId ?? p.shelter?.shelterId ?? null
        const shelterName = p.shelter?.name ?? p.shelterName ?? null
        // backend uses petId, photosJson (json string), temperament (comma list)
        let imageUrl = '';
        try {
          if (p.photosJson) {
            const arr = typeof p.photosJson === 'string' ? JSON.parse(p.photosJson) : p.photosJson;
            if (Array.isArray(arr) && arr.length > 0) imageUrl = arr[0];
          }
        } catch (e) {
          imageUrl = '';
        }

        const tags = p.temperament ? String(p.temperament).split(',').map(t => t.trim()).filter(Boolean) : [];

        return {
          id: p.petId ?? p.id,
          name: p.name,
          breed: p.breed,
          age: p.age,
          size: p.size ? String(p.size).toLowerCase() : '',
          species: p.species ?? p?.species ?? null,
          gender: p.gender ? String(p.gender).toLowerCase() : '',
          status: p.status ?? p?.status ?? null,
          shelterId,
          shelterName,
          imageUrl,
          tags,
          raw: p,
        }
      })

    } catch (error) {
      console.error('Error fetching all pets:', error);
      throw error; // Re-throw to be caught by the component
    }
  },

  /**
   * Fetches a single pet by its ID
   * Corresponds to GET /api/pets/{id}
   */
  getPetById: async (id) => {
    try {
      const response = await api.get(`/pets/${id}`);
      const p = response.data;
      if (!p) return null;
      const shelterId = p.shelterId ?? p.shelter?.shelterId ?? null
      const shelterName = p.shelter?.name ?? p.shelterName ?? null
      let imageUrl = '';
      try {
        if (p.photosJson) {
          const arr = typeof p.photosJson === 'string' ? JSON.parse(p.photosJson) : p.photosJson;
          if (Array.isArray(arr) && arr.length > 0) imageUrl = arr[0];
        }
      } catch (e) {
        imageUrl = '';
      }
      const tags = p.temperament ? String(p.temperament).split(',').map(t => t.trim()).filter(Boolean) : [];
      return {
        id: p.petId ?? p.id,
        name: p.name,
        breed: p.breed,
        age: p.age,
        size: p.size ? String(p.size).toLowerCase() : '',
        species: p.species ?? null,
        gender: p.gender ? String(p.gender).toLowerCase() : '',
        status: p.status ?? null,
        shelterId,
        shelterName,
        imageUrl,
        tags,
        raw: p,
      }
    } catch (error) {
      console.error(`Error fetching pet with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search and filter pets
   * Corresponds to GET /api/pets/search
   * @param {Object} filters - Object containing filter parameters
   * @returns {Promise<Array>} Array of filtered pets
   */
  searchPets: async (filters = {}) => {
    try {
      // Build query parameters from filters object
      const params = new URLSearchParams();
      
      if (filters.species) params.append('species', filters.species);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.breed) params.append('breed', filters.breed);
      if (filters.size) params.append('size', filters.size);
      if (filters.temperament) params.append('temperament', filters.temperament);
      if (filters.shelterLocation) params.append('shelterLocation', filters.shelterLocation);
      if (filters.minAge) params.append('minAge', filters.minAge);
      if (filters.maxAge) params.append('maxAge', filters.maxAge);

      const response = await api.get(`/pets/search?${params.toString()}`);
      const raw = response.data;
      if (!Array.isArray(raw)) {
        return [];
      }

      return raw.map((p) => {
        let imageUrl = '';
        try {
          if (p.photosJson) {
            const arr = typeof p.photosJson === 'string' ? JSON.parse(p.photosJson) : p.photosJson;
            if (Array.isArray(arr) && arr.length > 0) imageUrl = arr[0];
          }
        } catch (e) {
          imageUrl = '';
        }

        const tags = p.temperament ? String(p.temperament).split(',').map(t => t.trim()).filter(Boolean) : [];

        return {
          id: p.petId ?? p.id,
          name: p.name,
          breed: p.breed,
          age: p.age,
          size: p.size ? String(p.size).toLowerCase() : '',
          species: p.species,
          gender: p.gender ? String(p.gender).toLowerCase() : '',
          temperament: p.temperament,
          status: p.status ?? null,
          imageUrl,
          tags,
          raw: p,
        }
      });
    } catch (error) {
      console.error('Error searching pets:', error);
      throw error;
    }
  },

  createPet: async (payload) => {
    try {
      const res = await api.post('/pets', payload)
      return res.data
    } catch (err) {
      throw new Error(extractMessage(err))
    }
  },

  updatePet: async (petId, payload) => {
    try {
      const res = await api.put(`/pets/${petId}`, payload)
      return res.data
    } catch (err) {
      throw new Error(extractMessage(err))
    }
  },

  updatePetStatus: async (petId, status) => {
    try {
      const res = await api.patch(`/pets/${petId}/status`, { status })
      return res.data
    } catch (err) {
      throw new Error(extractMessage(err))
    }
  },
};