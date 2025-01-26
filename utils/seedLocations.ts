import { collection, doc, writeBatch } from "firebase/firestore";
import locationData from "@/constants/states-and-lgas-and-wards.json";
import { db } from "@/lib/firebase";

export async function seedLocations() {
  try {
    const batch = writeBatch(db);

    for (const state of locationData) {
      // Create state document
      const stateRef = doc(db, "nigeria-states", state.state.toLowerCase());
      batch.set(stateRef, { name: state.state.toLowerCase() });

      // Create LGAs subcollection
      const lgasCollectionRef = collection(stateRef, 'lgas');
      for (const lga of state.lgas) {
        const lgaRef = doc(lgasCollectionRef, lga.lga.toLowerCase());
        batch.set(lgaRef, {
          name: lga.lga.toLowerCase(),
          wards: lga.wards.map(ward => ward.toLowerCase())
        });
      }
    }

    await batch.commit();
    console.log("Location data seeded successfully");
  } catch (error) {
    console.error("Error seeding location data:", error);
  }
}
