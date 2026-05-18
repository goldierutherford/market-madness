import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Box } from '@react-three/drei';
import Shopkeeper3D from './Shopkeeper3D';

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

export default function ShopFacade3D({ onTransitionComplete }) {
  const shopkeeperRef = useRef();
  const doorHingeRef = useRef();
  const signRef = useRef();
  const hasTransitioned = useRef(false);

  const phaseRef = useRef('walking'); // 'walking', 'closing_door', 'flipping_sign', 'done'
  const timeInPhaseRef = useRef(0);

  // Safety net: if the scene stalls for any reason (font fail, context loss),
  // force-fire the transition after 12 seconds so the game never freezes.
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (!hasTransitioned.current) {
        hasTransitioned.current = true;
        onTransitionComplete();
      }
    }, 12000);
    return () => clearTimeout(safetyTimeout);
  }, [onTransitionComplete]);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    timeInPhaseRef.current += safeDelta;

    if (phaseRef.current === 'walking') {
      if (shopkeeperRef.current) {
        // Move from inside doorway Z = -2.0 to outside standing Z = 2.0
        const currentZ = shopkeeperRef.current.position.z;
        const targetZ = 2.0;
        shopkeeperRef.current.position.z = lerp(currentZ, targetZ, 4 * safeDelta);
        
        // Add a cute walking bounce/bob animation!
        const elapsed = timeInPhaseRef.current;
        shopkeeperRef.current.position.y = Math.abs(Math.sin(elapsed * 12)) * 0.12;
        
        // Waddle rotation
        shopkeeperRef.current.rotation.z = Math.sin(elapsed * 12) * 0.1;

        if (targetZ - shopkeeperRef.current.position.z < 0.05) {
          shopkeeperRef.current.position.z = targetZ;
          shopkeeperRef.current.position.y = 0;
          shopkeeperRef.current.rotation.z = 0;
          phaseRef.current = 'closing_door';
          timeInPhaseRef.current = 0;
        }
      }
    } else if (phaseRef.current === 'closing_door') {
      if (doorHingeRef.current) {
        // Hinge Y rotation from Math.PI / 2.2 (Open) to 0 (Closed)
        const currentRotY = doorHingeRef.current.rotation.y;
        const targetRotY = 0;
        doorHingeRef.current.rotation.y = lerp(currentRotY, targetRotY, 6 * safeDelta);

        if (currentRotY < 0.02) {
          doorHingeRef.current.rotation.y = 0;
          phaseRef.current = 'flipping_sign';
          timeInPhaseRef.current = 0;
        }
      }
    } else if (phaseRef.current === 'flipping_sign') {
      if (signRef.current) {
        // Sign Y rotation from 0 to Math.PI (Closed side facing camera)
        const currentRotY = signRef.current.rotation.y;
        const targetRotY = Math.PI;
        signRef.current.rotation.y = lerp(currentRotY, targetRotY, 6 * safeDelta);

        if (targetRotY - currentRotY < 0.02) {
          signRef.current.rotation.y = targetRotY;
          phaseRef.current = 'done';
          timeInPhaseRef.current = 0;
        }
      }
    } else if (phaseRef.current === 'done') {
      if (timeInPhaseRef.current > 1.2) {
        // Safe transition trigger
        phaseRef.current = 'triggered';
        if (!hasTransitioned.current) {
          hasTransitioned.current = true;
          onTransitionComplete();
        }
      }
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.8, 6]} fov={50} />
      
      {/* Dynamic Cinematic Lights */}
      <ambientLight intensity={1.8} color="#e0f2fe" />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <spotLight position={[0, 5, 2]} angle={0.6} penumbra={1} intensity={1.5} color="#fed7aa" />

      {/* Cobblestone Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* THE SHOP ARCHITECTURE */}
      {/* Dark Doorway Interior backing (to hide empty sky box inside) */}
      <mesh position={[0, 1.6, -0.6]}>
        <planeGeometry args={[2.2, 3.2]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Door Frame Left Wall */}
      <mesh position={[-2.5, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 4.0, 0.4]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.5} />
      </mesh>

      {/* Door Frame Right Wall */}
      <mesh position={[2.5, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 4.0, 0.4]} />
        <meshStandardMaterial color="#0ea5e9" roughness={0.5} />
      </mesh>

      {/* Top Shop Banner / Header */}
      <mesh position={[0, 4.0, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[8.0, 1.2, 0.5]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} />
      </mesh>

      {/* Decorative Golden Shop Sign Board — Solid 3D lettering replacement (no font loading) */}
      <group position={[0, 4.0, 0.32]}>
        {/* Golden embossed plaque instead of loaded Text */}
        <mesh>
          <boxGeometry args={[3.0, 0.5, 0.06]} />
          <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.3} roughness={0.2} metalness={0.6} />
        </mesh>
        {/* Decorative crown accent on plaque */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.4, 0.15, 0.06]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Decorative Awning */}
      <group position={[0, 3.4, 0.45]} rotation={[0.25, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[8.2, 0.1, 0.8]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.5} />
        </mesh>
      </group>

      {/* Cute shop windows on left and right sides */}
      {/* Left Window pane */}
      <mesh position={[-1.75, 1.8, 0.22]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.05]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.4} />
      </mesh>
      {/* Right Window pane */}
      <mesh position={[1.75, 1.8, 0.22]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.05]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.4} />
      </mesh>

      {/* Windowsill frames */}
      <mesh position={[-1.75, 1.0, 0.25]} castShadow>
        <boxGeometry args={[1.4, 0.1, 0.2]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>
      <mesh position={[1.75, 1.0, 0.25]} castShadow>
        <boxGeometry args={[1.4, 0.1, 0.2]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>

      {/* THE ANIMATED DOOR HINGE */}
      {/* Hinge is at the left side of the doorway frame (x = -1.0) */}
      <group ref={doorHingeRef} position={[-1.0, 0, 0]} rotation={[0, Math.PI / 2.2, 0]}>
        {/* Door board: width is 2.0. Shifted +1.0 in X so it rotates around the hinge axis */}
        <mesh position={[1.0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 3.2, 0.12]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        
        {/* Door brass handle */}
        <mesh position={[1.8, 1.6, 0.08]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* THE FLIPPING OPEN/CLOSED SIGN */}
      {/* Positioned on the wall to the right of the doorway frame (x = 1.45) */}
      <group ref={signRef} position={[1.45, 2.2, 0.25]} rotation={[0, 0, 0]}>
        {/* Base wood board */}
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.5, 0.05]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        
        {/* Front face: Green "OPEN" indicator (facing +Z) */}
        <group position={[0, 0, 0.03]}>
          <mesh>
            <boxGeometry args={[0.7, 0.3, 0.01]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.5} roughness={0.3} />
          </mesh>
        </group>

        {/* Back face: Red "CLOSED" indicator (facing -Z, rotated Math.PI on Y) */}
        <group position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
          <mesh>
            <boxGeometry args={[0.7, 0.3, 0.01]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* THE ANIMATED SHOPKEEPER */}
      {/* Positioned at door centre. Walks from inside door (Z = -2.0) to Z = 2.0 */}
      <group ref={shopkeeperRef} position={[0, 0, -2.0]} rotation={[0, Math.PI, 0]}>
        <Shopkeeper3D isEndOfDay={false} dialogue={null} />
      </group>
    </>
  );
}
