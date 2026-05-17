import React from 'react';
import Shopkeeper3D from './Shopkeeper3D';
import Customer3D from './Customer3D';

export default function Scooter3D({ direction = 'to_bank', isNPC = false }) {
  const isHeadingHome = direction === 'to_home';
  const rotation = isHeadingHome ? [0, Math.PI, 0] : [0, 0, 0];

  return (
    <group rotation={rotation}>
      {/* Front Wheel */}
      <mesh position={[0, 0.25, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Rear Wheel */}
      <mesh position={[0, 0.25, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Chassis / Floorboard */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 2]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>

      {/* Steering Column */}
      <mesh position={[0, 1.1, -0.7]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Handlebars */}
      <mesh position={[0, 1.6, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Headlight */}
      <mesh position={[0, 1.4, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#eab308" emissiveIntensity={1} />
      </mesh>

      {/* Rider */}
      <group position={[0, -0.05, 0.2]}>
        {isNPC ? (
          <Customer3D reaction="neutral" itemName="Scooter" />
        ) : (
          <Shopkeeper3D isEndOfDay={false} dialogue={null} />
        )}
      </group>
    </group>
  );
}
