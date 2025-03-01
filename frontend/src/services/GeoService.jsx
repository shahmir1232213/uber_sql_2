// src/services/GeoService.js
import axios from 'axios';

const GeoService = {
  async getCoordinates(location) {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: location,
          format: 'json',
          limit: 1
        }
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  }
};

export default GeoService;
