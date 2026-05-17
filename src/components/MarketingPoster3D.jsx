import React from "react";
import { Text } from "@react-three/drei";

export default function MarketingPoster3D({ position = [-1.15, 2.6, -2.8], rotation = [0, 0, 0.06] }) {
  return (
    <group position={position} rotation={rotation}>
      
      {/* 1. Paper Poster Sheet (Very thin yellow box) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.9, 0.015]} />
        <meshStandardMaterial 
          color="#facc15" 
          roughness={0.9} 
          metalness={0.05} 
        />
      </mesh>

      {/* 2. Dark Outline for Chibi/Cell-Shaded Pop aesthetic */}
      <mesh position={[0, 0, -0.005]}>
        <boxGeometry args={[0.74, 0.94, 0.01]} />
        <meshStandardMaterial 
          color="#1e293b" 
          roughness={0.8} 
        />
      </mesh>

      {/* 3. Wall Tape attachment decals on corners */}
      {/* Top Left Tape */}
      <mesh position={[-0.32, 0.42, 0.012]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.06, 0.005]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.8} roughness={0.7} />
      </mesh>
      {/* Top Right Tape */}
      <mesh position={[0.32, 0.42, 0.012]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.06, 0.005]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.8} roughness={0.7} />
      </mesh>

      {/* 4. Bold Red Marketing Text */}
      <Text
        position={[0, 0.24, 0.012]}
        fontSize={0.095}
        color="#dc2626"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/outfit/v11/08pykQ1TvOGqR1Df3vWCAw.woff"
        fontWeight="bold"
      >
        HUGE
      </Text>

      <Text
        position={[0, 0.02, 0.012]}
        fontSize={0.11}
        color="#dc2626"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/outfit/v11/08pykQ1TvOGqR1Df3vWCAw.woff"
        fontWeight="black"
      >
        SALE
      </Text>

      <Text
        position={[0, -0.22, 0.012]}
        fontSize={0.085}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/outfit/v11/08pykQ1TvOGqR1Df3vWCAw.woff"
        fontWeight="bold"
      >
        TODAY!
      </Text>

      {/* Decorative cute star icons */}
      <Text
        position={[-0.2, -0.34, 0.012]}
        fontSize={0.06}
        color="#dc2626"
        anchorX="center"
        anchorY="middle"
      >
        ★
      </Text>
      <Text
        position={[0.2, -0.34, 0.012]}
        fontSize={0.06}
        color="#dc2626"
        anchorX="center"
        anchorY="middle"
      >
        ★
      </Text>

    </group>
  );
}
