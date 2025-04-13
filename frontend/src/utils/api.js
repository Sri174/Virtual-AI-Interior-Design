import axios from "axios";

// Base URL of your backend API
const API_BASE_URL = "https://virtual-ai-interior-design.onrender.com";

export async function generateDesign(data) {
  const response = await fetch(`${hilarious-pony-ff3c99.netlify.app}/generate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

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
