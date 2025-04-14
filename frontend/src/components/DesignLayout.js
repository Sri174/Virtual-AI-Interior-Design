// src/components/DesignLayout.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

const DesignLayout = ({ layout }) => {
  return (
    <div>
    <Canvas camera={{ position: [10, 10, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Walls */}
      {layout?.walls?.map((wall, index) => (
        <Box key={index} args={[wall.length, 0.2, 3]} position={wall.position}>
          <meshStandardMaterial color="#cccccc" />
        </Box>
      ))}
      
      {/* Furniture */}
      {layout?.elements?.map((item, index) => (
        <group key={index} position={item.position}>
          <Box args={item.dimensions}>
            <meshStandardMaterial color={item.color} />
          </Box>
          <Text position={[0, 1, 0]} fontSize={0.2}>
            {item.name}
          </Text>
        </group>
      ))}
    </Canvas>
     <img src={`http://localhost:8000${layout.image_url}`} alt="AI Design" width="300" />
    </div>
  );
};

export default DesignLayout;
