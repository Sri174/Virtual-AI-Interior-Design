import axios from "axios";

// Base URL of your backend API
const API_BASE_URL = "http://localhost:8000/api";

// Call to generate design
export const generateDesign = async (roomType, style) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${API_BASE_URL}/generate-design/`,
      { room_type: roomType, style: style },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.image_url;
  } catch (error) {
    console.error("Design generation failed:", error);
    throw error;
  }
};
