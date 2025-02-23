import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;


export const locationService = {
  async getStates() {
    try {
      const response = await axios.get(`${API_BASE_URL}/${API_VERSION}/locations/states`);
      return response.data;
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  },

  async getLGAs(state: string) {
    if (!state) return [];
    try {
      const response = await axios.get(`${API_BASE_URL}/${API_VERSION}/locations/states/${state}/lgas`);
      return response.data;
    } catch (error) {
      console.error("Error fetching LGAs:", error);
      return [];
    }
  },

  async getWards(state: string, lga: string) {
    if (!state || !lga) return [];
    try {
      const response = await axios.get(`${API_BASE_URL}/${API_VERSION}/locations/states/${state}/lgas/${lga}/wards`);
      return response.data;
    } catch (error) {
      console.error("Error fetching wards:", error);
      return [];
    }
  }
};