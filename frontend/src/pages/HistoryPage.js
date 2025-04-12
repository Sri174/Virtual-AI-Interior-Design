import { useEffect, useState } from 'react';

const History = () => {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const fetchDesigns = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:8000/api/designs/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const data = await res.json();
        setDesigns(data);
      } catch (err) {
        console.error('Failed to fetch history');
      }
    };

    fetchDesigns();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Your Design History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {designs.map((design, index) => (
          <div key={index} className="bg-white bg-opacity-5 p-4 rounded-lg shadow">
            <p className="text-sm text-white mb-2">Uploaded: {new Date(design.created_at).toLocaleString()}</p>
            <div className="flex gap-4">
              <img src={design.input_image} alt="input" className="w-1/2 rounded-lg" />
              <img src={design.generated_image} alt="output" className="w-1/2 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
