import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

export const locationService = {
  async getStates() {
    try {
      const statesRef = collection(db, "nigeria-states");
      const snapshot = await getDocs(statesRef);
      return snapshot.docs.map((doc) => doc.id);
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  },

  async getLGAs(state: string) {
    if (!state) return [];
    try {
      const lgasRef = collection(db, `nigeria-states/${state}/lgas`);
      const snapshot = await getDocs(lgasRef);
      return snapshot.docs.map((doc) => doc.id);
    } catch (error) {
      console.error("Error fetching LGAs:", error);
      return [];
    }
  },

  async getWards(state: string, lga: string) {
    if (!state || !lga) return [];
    try {
      const wardsRef = collection(db, `nigeria-states/${state}/lgas`);
      const lgaDoc = await getDoc(doc(wardsRef, lga));
      return lgaDoc.data()?.wards || [];
    } catch (error) {
      console.error("Error fetching wards:", error);
      return [];
    }
  }
};