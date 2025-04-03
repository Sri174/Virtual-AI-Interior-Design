import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./config";

function App() {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!image) {
            setMessage("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload-image/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Upload failed");
        }
    };

    return (
        <div>
            <h1>AI Interior Design</h1>
            <input type="file" onChange={handleImageUpload} />
            <button onClick={uploadImage}>Upload</button>
            <p>{message}</p>
        </div>
    );
}

export default App;
