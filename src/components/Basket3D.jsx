import React from "react";

export default function Basket3D({ position = [0, 0, 0], children }) {
  return (
    <group position={position}>
      {/* Base of wicker basket */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>
      
      {/* Walls of wicker basket */}
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.15, 16, 1, true]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} side={2} />
      </mesh>

      {/* Children shift up on Y-axis sitting inside the basket */}
      <group position={[0, 0.1, 0]}>
        {children}
      </group>
    </group>
  );
}
