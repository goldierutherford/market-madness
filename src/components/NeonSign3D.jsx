import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

// Reusable letters component for Tiers 1 and 2 to ensure clean, modular code
const OpenLetters = ({ color, name }) => (
  <group>
    {/* LETTER 'O' */}
    <group position={[-0.45, 0, 0]}>
      <mesh name={name}>
        <torusGeometry args={[0.13, 0.012, 16, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
    </group>

    {/* LETTER 'P' */}
    <group position={[-0.15, 0, 0]}>
      <mesh name={name} position={[-0.07, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
      <mesh name={name} position={[-0.03, 0.06, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.012, 16, 16, Math.PI]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
    </group>

    {/* LETTER 'E' */}
    <group position={[0.15, 0, 0]}>
      <mesh name={name} position={[-0.06, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
      <mesh name={name} position={[-0.01, 0.115, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.11, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
      <mesh name={name} position={[-0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.09, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
      <mesh name={name} position={[-0.01, -0.115, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.11, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
    </group>

    {/* LETTER 'N' */}
    <group position={[0.45, 0, 0]}>
      <mesh name={name} position={[-0.07, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
      <mesh name={name} position={[0, 0, 0]} rotation={[0, 0, -0.52]}>
        <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
      <mesh name={name} position={[0.07, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3.5} 
          toneMapped={false} 
        />
      </mesh>
    </group>
  </group>
);

// 3D Neon Star overlay box for high visual excellence
const NeonStar = React.forwardRef(({ position }, ref) => (
  <group position={position} ref={ref}>
    <mesh name="neon-star">
      <boxGeometry args={[0.16, 0.16, 0.02]} />
      <meshStandardMaterial 
        color="#eab308" 
        emissive="#eab308" 
        emissiveIntensity={3.0} 
        toneMapped={false} 
      />
    </mesh>
    <mesh name="neon-star" rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.16, 0.16, 0.02]} />
      <meshStandardMaterial 
        color="#eab308" 
        emissive="#eab308" 
        emissiveIntensity={3.0} 
        toneMapped={false} 
      />
    </mesh>
  </group>
));

export default function NeonSign3D({ tier = 1, position = [0, 3.2, -2.8], rotation = [0, 0, 0] }) {
  const groupRef = useRef();
  const starRef1 = useRef();
  const starRef2 = useRef();

  // Unified high-frequency voltage discharge flicker controller
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate retro neon star components
    if (starRef1.current) starRef1.current.rotation.z = time * 1.6;
    if (starRef2.current) starRef2.current.rotation.z = -time * 1.6;

    if (!groupRef.current) return;

    // Independent transformer noise generators
    const redIntensity = 3.2 + Math.sin(time * 30) * 0.4 + (Math.random() > 0.98 ? -1.5 : 0);
    const pinkIntensity = 3.5 + Math.sin(time * 35) * 0.5 + (Math.random() > 0.985 ? -2.2 : 0);
    const cyanIntensity = 2.8 + Math.cos(time * 25) * 0.4 + (Math.random() > 0.99 ? -1.8 : 0);
    
    const superIntensity = 4.2 + Math.sin(time * 40) * 0.6 + (Math.random() > 0.985 ? -2.0 : 0);
    const marketIntensity = 4.5 + Math.cos(time * 32) * 0.5 + (Math.random() > 0.98 ? -2.5 : 0);
    const starIntensity = 3.0 + Math.sin(time * 8) * 1.2; // Slow warm breathing pulse

    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.name === "neon-red") {
          child.material.emissiveIntensity = redIntensity;
        } else if (child.name === "neon-pink") {
          child.material.emissiveIntensity = pinkIntensity;
        } else if (child.name === "neon-cyan") {
          child.material.emissiveIntensity = cyanIntensity;
        } else if (child.name === "neon-super") {
          child.material.emissiveIntensity = superIntensity;
        } else if (child.name === "neon-market") {
          child.material.emissiveIntensity = marketIntensity;
        } else if (child.name === "neon-star") {
          child.material.emissiveIntensity = starIntensity;
        }
      }
    });
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      
      {/* ================= TIER 1: SIMPLE RED OPEN SIGN ================= */}
      {tier === 1 && (
        <group>
          {/* Small translucent backboard */}
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[1.2, 0.45, 0.02]} />
            <meshStandardMaterial 
              color="#020408" 
              roughness={0.9} 
              transparent 
              opacity={0.65} 
            />
          </mesh>
          {/* Glowing Red Open Letters */}
          <OpenLetters color="#ef4444" name="neon-red" />
        </group>
      )}

      {/* ================= TIER 2: DETAILED PINK OPEN WITH CYAN BORDER ================= */}
      {tier === 2 && (
        <group>
          {/* Standard translucent backboard */}
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[1.4, 0.6, 0.02]} />
            <meshStandardMaterial 
              color="#06080c" 
              roughness={0.9} 
              metalness={0.8}
              transparent
              opacity={0.75}
            />
          </mesh>

          {/* Dark metallic outer wireframe border */}
          <mesh position={[0, 0, -0.03]}>
            <boxGeometry args={[1.42, 0.62, 0.01]} />
            <meshStandardMaterial 
              color="#121620" 
              roughness={0.5} 
              metalness={0.9}
              wireframe
            />
          </mesh>

          {/* Glowing Cyan blue border frames */}
          <mesh name="neon-cyan" position={[0, 0.26, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 1.3, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh name="neon-cyan" position={[0, -0.26, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 1.3, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh name="neon-cyan" position={[-0.65, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.52, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh name="neon-cyan" position={[0.65, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.52, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>

          {/* Glowing Hot Pink Open Letters */}
          <OpenLetters color="#ec4899" name="neon-pink" />
        </group>
      )}

      {/* ================= TIER 3: MASSIVE MULTI-COLOURED SUPER MARKET SIGN ================= */}
      {tier === 3 && (
        <group>
          {/* Double-size premium translucent backboard */}
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[2.4, 1.1, 0.02]} />
            <meshStandardMaterial 
              color="#030712" 
              roughness={0.95} 
              metalness={0.9}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Double-layer glowing border framework (Cyan-Magenta) */}
          <mesh name="neon-cyan" position={[0, 0.51, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 2.3, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh name="neon-pink" position={[0, -0.51, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 2.3, 8]} />
            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh name="neon-cyan" position={[-1.15, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.0, 8]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh name="neon-pink" position={[1.15, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.0, 8]} />
            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>

          {/* "SUPER" - Large glowing yellow-gold 3D blocky font */}
          <Text
            name="neon-super"
            position={[0, 0.22, 0.01]}
            fontSize={0.34}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/outfit/v11/08pykQ1TvOGqR1Df3vWCAw.woff"
          >
            SUPER
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#fbbf24" 
              emissiveIntensity={4.0} 
              toneMapped={false} 
            />
          </Text>

          {/* "MARKET" - Extra-large glowing pink 3D blocky font */}
          <Text
            name="neon-market"
            position={[0, -0.22, 0.01]}
            fontSize={0.38}
            color="#ec4899"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/outfit/v11/08pykQ1TvOGqR1Df3vWCAw.woff"
          >
            MARKET
            <meshStandardMaterial 
              color="#ec4899" 
              emissive="#ec4899" 
              emissiveIntensity={4.5} 
              toneMapped={false} 
            />
          </Text>

          {/* Rotating retro 8-point stars on flanks */}
          <NeonStar position={[-0.85, 0, 0.01]} ref={starRef1} />
          <NeonStar position={[0.85, 0, 0.01]} ref={starRef2} />
        </group>
      )}

    </group>
  );
}
