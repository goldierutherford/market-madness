import React from 'react';

export default function TrafficLight3D({ state = 'red', position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Housing */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Red Light */}
      <mesh position={[0, 4.2, 0.41]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color={state === 'red' ? '#ff3333' : '#330000'} 
          emissive="#ff0000" 
          emissiveIntensity={state === 'red' ? 2 : 0} 
          toneMapped={false} 
        />
      </mesh>

      {/* Amber Light */}
      <mesh position={[0, 3.5, 0.41]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color={state === 'amber' ? '#ffcc00' : '#332200'} 
          emissive="#ffcc00" 
          emissiveIntensity={state === 'amber' ? 2 : 0} 
          toneMapped={false} 
        />
      </mesh>

      {/* Green Light */}
      <mesh position={[0, 2.8, 0.41]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color={state === 'green' ? '#33ff33' : '#003300'} 
          emissive="#00ff00" 
          emissiveIntensity={state === 'green' ? 2 : 0} 
          toneMapped={false} 
        />
      </mesh>
    </group>
  );
}
