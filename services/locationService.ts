import axios from 'axios';
import { showErrorToast } from '../utils/toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;


export const locationService = {
  async getStates() {
    try {
      const response = await axios.get(`${API_BASE_URL}/${API_VERSION}/locations/states`);
      return response.data;
    } catch (error) {
      console.error("Error fetching states:", error);
      showErrorToast("Failed to fetch states. Please try again later.");
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
      showErrorToast("Failed to fetch LGAs. Please try again later.");
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
      showErrorToast("Failed to fetch wards. Please try again later.");
      return [];
    }
  }
};