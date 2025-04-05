import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// Save the design data to Firestore
const saveDesign = async (userId, prompt, imageUrl) => {
  try {
    const docRef = await addDoc(collection(db, "designs"), {
      userId,
      prompt,
      imageUrl,
      createdAt: new Date(),
    });
    console.log("Design saved with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving design:", error);
  }
};

export default saveDesign;
