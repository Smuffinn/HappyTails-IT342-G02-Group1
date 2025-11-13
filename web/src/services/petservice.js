import api from './api';

// This file contains functions that call specific backend endpoints

export const petService = {
  /**
   * Fetches all pets from the backend
   * Corresponds to GET /api/pets
   */
  getAllPets: async () => {
    try {
      const response = await api.get('/pets');
      // Normalize backend pet shape to UI-friendly object
      const raw = response.data || [];
      return raw.map((p) => {
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
        imageUrl,
        tags,
        raw: p,
      }
    } catch (error) {
      console.error(`Error fetching pet with id ${id}:`, error);
      throw error;
    }
  },

  // We will add createPet, updatePet, etc. here later
};