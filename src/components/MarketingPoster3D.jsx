import React from "react";
import { Html } from "@react-three/drei";

export default function MarketingPoster3D({ position = [0.7, 1.15, 0.5], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>

      {/* A-Frame Easel Stand Base */}
      {/* Front leg */}
      <mesh position={[0, -0.12, 0.06]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.02, 0.25, 0.02]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Back leg */}
      <mesh position={[0, -0.12, -0.06]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.02, 0.25, 0.02]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Poster Card (Slightly angled back on the easel) */}
      <group position={[0, 0.08, 0.02]} rotation={[-0.1, 0, 0]}>

        {/* 1. Dark backing board */}
        <mesh position={[0, 0, -0.006]}>
          <boxGeometry args={[0.34, 0.42, 0.008]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* 2. Bright yellow poster face */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.30, 0.38, 0.008]} />
          <meshStandardMaterial
            color="#facc15"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* 3. Cute red corner triangles */}
        {/* Top-left */}
        <mesh position={[-0.12, 0.155, 0.006]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.06, 0.06, 0.003]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        {/* Top-right */}
        <mesh position={[0.12, 0.155, 0.006]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.06, 0.06, 0.003]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        {/* Bottom-left */}
        <mesh position={[-0.12, -0.155, 0.006]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.06, 0.06, 0.003]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
        {/* Bottom-right */}
        <mesh position={[0.12, -0.155, 0.006]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.06, 0.06, 0.003]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>

        {/* 4. Text rendered via Html to avoid external font issues */}
        <Html
          position={[0, 0.01, 0.01]}
          center
          transform
          distanceFactor={1.2}
          occlude={false}
        >
          <div
            style={{
              width: "80px",
              textAlign: "center",
              fontFamily: "'Segoe UI', 'Arial Black', sans-serif",
              userSelect: "none",
              pointerEvents: "none",
              lineHeight: 1.1
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: 900, color: "#dc2626", letterSpacing: "1.5px" }}>
              HUGE
            </div>
            <div style={{ fontSize: "15px", fontWeight: 900, color: "#dc2626", letterSpacing: "2px", marginTop: "1px" }}>
              SALE
            </div>
            <div style={{ fontSize: "9px", fontWeight: 900, color: "#1e293b", letterSpacing: "1px", marginTop: "2px" }}>
              TODAY!
            </div>
            <div style={{ fontSize: "7px", color: "#dc2626", marginTop: "2px", letterSpacing: "4px" }}>
              ★ ★
            </div>
          </div>
        </Html>
      </group>

    </group>
  );
}
