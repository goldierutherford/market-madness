import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Teller3D from "./Teller3D";
import Shopkeeper3D from "./Shopkeeper3D";
import Customer3D from "./Customer3D";

function BankScene({ isLeaving, onAtCounter, onLeaveComplete }) {
  const shopkeeperParentRef = useRef();
  const currentZ = useRef(12.0); // Start parent at 12.0 (off-screen bottom for fov=45)

  // Unified cinematic state director
  const [sceneState, setSceneState] = useState("walking_in");
  const [shopkeeperText, setShopkeeperText] = useState(null);
  const [tellerText, setTellerText] = useState(null);

  // Background randomized customer meeting parameters
  const { bgReaction, bgItemName } = useMemo(() => {
    const reactions = ["neutral", "bargain", "acceptable", "expensive"];
    const items = ["Mortgage", "Business Loan", "Credit Card", "Savings Plan", "Investment"];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    return { bgReaction: randomReaction, bgItemName: randomItem };
  }, []);

  useFrame((state, delta) => {
    if (!shopkeeperParentRef.current) return;

    if (sceneState === "walking_in") {
      // Direct Stevie to face away from the camera towards the counter
      shopkeeperParentRef.current.rotation.y = Math.PI;

      // Stop walking in at Z = -1.5 (perfectly in front of the new counter at Z = -4)
      if (currentZ.current > -1.5) {
        currentZ.current = Math.max(-1.5, currentZ.current - delta * 2.2);
        shopkeeperParentRef.current.position.z = currentZ.current;
      } else {
        setSceneState("shopkeeper_talking");
      }
    } else if (sceneState === "walking_out") {
      // Smoothly rotate 180 degrees to face the camera/doorway
      if (shopkeeperParentRef.current.rotation.y > 0) {
        shopkeeperParentRef.current.rotation.y = Math.max(0, shopkeeperParentRef.current.rotation.y - delta * 5.0);
      }

      if (currentZ.current < 12.0) {
        currentZ.current = Math.min(12.0, currentZ.current + delta * 2.2);
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

      {/* Back Wall: Professional dark slate vault wall pushed back */}
      <mesh position={[0, 2, -7.5]} receiveShadow castShadow>
        <boxGeometry args={[14, 4.5, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Architectural Pillars pushed back */}
      <mesh position={[-6.8, 2.25, -7.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 4.5, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
      </mesh>
      <mesh position={[6.8, 2.25, -7.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 4.5, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
      </mesh>

      {/* Glowing Royal Savings Bank Emblem on back wall */}
      <mesh position={[0, 3.0, -7.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>

      {/* MAIN TELLER SECTION (Pushed back to Z = -4) */}
      {/* Bank Counter: Dark mahogany wood body */}
      <mesh position={[0, 0.4, -4]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      {/* Counter Top Slab (glowing marble/amber top) */}
      <mesh position={[0, 0.82, -4]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.04, 0.95]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.1} />
      </mesh>

      {/* Glass Partition Column Dividers */}
      <mesh position={[-1.5, 1.25, -4]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.6]} />
        <meshStandardMaterial color="#475569" roughness={0.2} />
      </mesh>
      <mesh position={[1.5, 1.25, -4]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.6]} />
        <meshStandardMaterial color="#475569" roughness={0.2} />
      </mesh>

      {/* Glass Safety Partition Panels */}
      <mesh position={[-0.85, 1.25, -4]}>
        <boxGeometry args={[1.2, 0.8, 0.04]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.1} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.85, 1.25, -4]}>
        <boxGeometry args={[1.2, 0.8, 0.04]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.1} transparent opacity={0.3} />
      </mesh>

      {/* Teller: Placed perfectly behind the counter desk, fed with dialogue text */}
      <group position={[0, 0.84, -4.8]}>
        <Teller3D dialogue={tellerText} />
      </group>


      {/* BACKGROUND MANAGER SECTION (Right side of the room at Z = -2) */}
      {/* Manager's Mahogany Desk */}
      <mesh position={[5, 0.4, -2]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      {/* Manager Desk Top Slab */}
      <mesh position={[5, 0.82, -2]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.04, 0.95]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.1} />
      </mesh>

      {/* The Manager (Stationary character behind table facing outward) */}
      <group position={[5, 0.84, -2.8]} scale={0.95} rotation={[0, 0, 0]}>
        <Teller3D dialogue={null} />
      </group>

      {/* The Random Customer (Stationary on opposite side of table facing manager) */}
      <group position={[5, 0, -0.5]}>
        <Customer3D 
          isStationary 
          reaction={bgReaction} 
          itemName={bgItemName} 
        />
      </group>


      {/* Shopkeeper (Stevie): Walk-in parent group starting from the doorway, fed with dialogue text */}
      <group ref={shopkeeperParentRef} position={[0, -0.65, 12.0]} rotation={[0, Math.PI, 0]}>
        <Shopkeeper3D isEndOfDay={false} dialogue={shopkeeperText} />
      </group>

      {/* Queue Stanchions (Golden posts styling the bank walkway) */}
      <group>
        {/* Left Stanchions */}
        <mesh position={[-1.2, 0.4, 1.0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, 0.02, 1.0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, 0.4, 5.0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, 0.02, 5.0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Right Stanchions */}
        <mesh position={[1.2, 0.4, 1.0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.2, 0.02, 1.0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.2, 0.4, 5.0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.2, 0.02, 5.0]} castShadow>
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
        {/* Re-staged high angle camera to capture the spacious lobby and meeting desk */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 6, 12]} 
          fov={45} 
          rotation={[-0.4, 0, 0]}
        />
        
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
