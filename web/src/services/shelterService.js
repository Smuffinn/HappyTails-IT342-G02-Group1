import api from './api';

const shelterService = {
  // Get all shelters
  getAllShelters: async () => {
    try {
      const response = await api.get('/shelters');
      return response.data;
    } catch (error) {
      console.error('Error fetching shelters:', error);
      throw error;
    }
  },

  // Get shelter by ID
  getShelterById: async (id) => {
    try {
      const response = await api.get(`/shelters/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shelter:', error);
      throw error;
    }
  },

  // Update shelter profile (for staff only)
  updateShelter: async (id, shelterData) => {
    try {
      const response = await api.put(`/shelters/${id}`, shelterData);
      return response.data;
    } catch (error) {
      console.error('Error updating shelter:', error);
      throw error;
    }
  },

  // Get current staff's shelter
  getMyShelter: async () => {
    try {
      const response = await api.get('/staff/my-shelter');
      return response.data;
    } catch (error) {
      console.error('Error fetching staff shelter:', error);
      throw error;
    }
  },

  // Update current staff's shelter
  updateMyShelter: async (shelterData) => {
    try {
      const response = await api.put('/staff/my-shelter', shelterData);
      return response.data;
    } catch (error) {
      console.error('Error updating staff shelter:', error);
      throw error;
    }
  },

  // Register staff with shelter ID
  registerStaff: async (staffData) => {
    try {
      const response = await api.post('/auth/register/staff', staffData);
      return response.data;
    } catch (error) {
      console.error('Error registering staff:', error);
      throw error;
    }
  }
};

export default shelterService;
