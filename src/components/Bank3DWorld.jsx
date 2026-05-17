import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Teller3D from "./Teller3D";
import Shopkeeper3D from "./Shopkeeper3D";

function BankScene({ isLeaving, onAtCounter, onLeaveComplete }) {
  const shopkeeperParentRef = useRef();
  const currentZ = useRef(8.6); // Start parent at 8.6

  // Unified cinematic state director
  const [sceneState, setSceneState] = useState("walking_in");
  const [shopkeeperText, setShopkeeperText] = useState(null);
  const [tellerText, setTellerText] = useState(null);

  useFrame((state, delta) => {
    if (!shopkeeperParentRef.current) return;

    if (sceneState === "walking_in") {
      // Direct Stevie to face away from the camera towards the counter
      shopkeeperParentRef.current.rotation.y = Math.PI;

      if (currentZ.current > 2.5) {
        currentZ.current = Math.max(2.5, currentZ.current - delta * 2.2);
        shopkeeperParentRef.current.position.z = currentZ.current;
      } else {
        setSceneState("shopkeeper_talking");
      }
    } else if (sceneState === "walking_out") {
      // Smoothly rotate 180 degrees to face the camera/doorway
      if (shopkeeperParentRef.current.rotation.y > 0) {
        shopkeeperParentRef.current.rotation.y = Math.max(0, shopkeeperParentRef.current.rotation.y - delta * 5.0);
      }

      if (currentZ.current < 8.5) {
        currentZ.current = Math.min(8.5, currentZ.current + delta * 2.2);
        shopkeeperParentRef.current.position.z = currentZ.current;
      } else {
        setSceneState("left_bank");
        if (onLeaveComplete) {
          onLeaveComplete();
        }
      }
    }
  });

  // Watch for the leaving trigger when deposit is confirmed
  useEffect(() => {
    if (isLeaving && sceneState === "deposit_ready") {
      setSceneState("walking_out");
    }
  }, [isLeaving, sceneState]);

  // Timed dialogue script sequence
  useEffect(() => {
    let timer;

    if (sceneState === "shopkeeper_talking") {
      setShopkeeperText("Morning! Need to drop off the week's takings.");
      timer = setTimeout(() => {
        setSceneState("teller_talking");
      }, 2500); // Wait 2.5 seconds
    } else if (sceneState === "teller_talking") {
      setShopkeeperText(null);
      setTellerText("No problem! Let's get that sorted.");
      timer = setTimeout(() => {
        setTellerText(null);
        setSceneState("deposit_ready");
        if (onAtCounter) {
          onAtCounter();
        }
      }, 2500); // Wait 2.5 seconds
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sceneState, onAtCounter]);

  return (
    <>
      {/* Lighting Configuration */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        castShadow 
        position={[5, 12, 5]} 
        intensity={1.5} 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <spotLight position={[0, 5, 1.5]} angle={0.8} penumbra={1} intensity={2.5} color="#fbbf24" />

      {/* Floor: Glossy modern marble floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.12} metalness={0.05} />
      </mesh>

      {/* Back Wall: Professional dark slate vault wall */}
      <mesh position={[0, 2, -3.5]} receiveShadow castShadow>
        <boxGeometry args={[8, 4.5, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Architectural Pillars */}
      <mesh position={[-3.8, 2.25, -3.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 4.5, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
      </mesh>
      <mesh position={[3.8, 2.25, -3.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 4.5, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
      </mesh>

      {/* Glowing Royal Savings Bank Emblem on wall */}
      <mesh position={[0, 3.0, -3.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>

      {/* Bank Counter: Dark mahogany wood body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      {/* Counter Top Slab (glowing marble/amber top) */}
      <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.04, 0.95]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.1} />
      </mesh>

      {/* Glass Partition Column Dividers */}
      <mesh position={[-1.5, 1.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.6]} />
        <meshStandardMaterial color="#475569" roughness={0.2} />
      </mesh>
      <mesh position={[1.5, 1.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.6]} />
        <meshStandardMaterial color="#475569" roughness={0.2} />
      </mesh>

      {/* Glass Safety Partition Panels */}
      <mesh position={[-0.85, 1.25, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.04]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.1} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.85, 1.25, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.04]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.1} transparent opacity={0.3} />
      </mesh>

      {/* Teller: Placed perfectly behind the counter desk, fed with dialogue text */}
      <group position={[0, 0.84, -0.8]}>
        <Teller3D dialogue={tellerText} />
      </group>

      {/* Shopkeeper (Stevie): Walk-in parent group starting from the doorway, fed with dialogue text */}
      <group ref={shopkeeperParentRef} position={[0, -0.65, 8.6]} rotation={[0, Math.PI, 0]}>
        <Shopkeeper3D isEndOfDay={false} dialogue={shopkeeperText} />
      </group>

      {/* Queue Stanchions (Golden posts styling the bank walkway) */}
      <group>
        {/* Left Stanchions */}
        <mesh position={[-1.2, 0.4, 3.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, 0.02, 3.2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, 0.4, 5.8]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, 0.02, 5.8]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Right Stanchions */}
        <mesh position={[1.2, 0.4, 3.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.2, 0.02, 3.2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.2, 0.4, 5.8]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.2, 0.02, 5.8]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </>
  );
}

export default function Bank3DWorld({ isLeaving, onAtCounter, onLeaveComplete }) {
  return (
    <div className="w-full h-full relative bg-slate-950">
      <Canvas
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        {/* Slightly low angle, isometric portrait camera to capture walk-in dynamics */}
        <PerspectiveCamera makeDefault position={[0, 2.4, 5.2]} fov={42} />
        
        {/* Render interactive bank floor scene */}
        <BankScene 
          isLeaving={isLeaving} 
          onAtCounter={onAtCounter} 
          onLeaveComplete={onLeaveComplete} 
        />
      </Canvas>
    </div>
  );
}
