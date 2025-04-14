import axios from "axios";

// Base URL of your backend API (from .env file)
export const API_BASE = process.env.REACT_APP_API_BASE_URL;

// Function to generate design
export const generateDesign = async (roomType, style) => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(
      `${API_BASE}/generate-design/`,
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
