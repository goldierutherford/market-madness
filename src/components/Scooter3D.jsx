import React from 'react';
import Shopkeeper3D from './Shopkeeper3D';
import Customer3D from './Customer3D';

export default function Scooter3D({ direction, isNPC = false, scooterColour = '#4ade80', faceReaction = 'neutral' }) {
  const rotationY = direction === 'to_home' ? Math.PI : 0;

  return (
    <group rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.15, 2.2]} />
        <meshStandardMaterial color={scooterColour} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, -0.8]} castShadow rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.6, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.9, -0.9]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.3, -0.8]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.3, 0.8]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 1.5, -1.05]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <group position={[0, 0.5, 0.2]}>
        {isNPC ? <Customer3D reaction={faceReaction} itemName="Scooter" /> : <Shopkeeper3D />}
      </group>
    </group>
  );
}
