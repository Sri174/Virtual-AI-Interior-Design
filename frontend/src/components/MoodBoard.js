import { useState } from 'react';

export default function MoodBoard() {
  const [selectedItems, setSelectedItems] = useState([]);
  
  const designItems = [
    { id: 1, type: 'color', value: '#E5E7EB', name: 'Light Gray' },
    { id: 2, type: 'furniture', value: 'sofa-modern.jpg', name: 'Modern Sofa' }
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Your Mood Board</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {selectedItems.map(item => (
          <div key={item.id} className="relative group">
            {item.type === 'color' ? (
              <div 
                className="h-24 rounded-lg shadow-md"
                style={{ backgroundColor: item.value }}
              />
            ) : (
              <img 
                src={`/assets/${item.value}`} 
                alt={item.name}
                className="h-24 w-full object-cover rounded-lg"
              />
            )}
            <button 
              onClick={() => setSelectedItems(selectedItems.filter(i => i.id !== item.id))}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Add Items</h4>
        <div className="flex flex-wrap gap-3">
          {designItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedItems([...selectedItems, item])}
              className="px-3 py-2 bg-white border rounded-lg hover:bg-indigo-50 transition"
            >
              + {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}