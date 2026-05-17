import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Plane, Box } from "@react-three/drei";
import { stockCatalogue } from "../hooks/useGameState";
import Customer3D from "./Customer3D";
import Shopkeeper3D from "./Shopkeeper3D";
import ShelfItem3D from "./ShelfItem3D";
import NeonSign3D from "./NeonSign3D";
import MarketingPoster3D from "./MarketingPoster3D";
import * as THREE from "three";

// Coordinates for the 15 items in the master catalogue across the three shelves
const SHELF_LOCATIONS = {
  // Left produce rack (x = -2.2, y = 0.95)
  apple: [-2.2, 0.95, -0.6],
  cucumber: [-2.2, 0.95, -0.2],
  watermelon: [-2.2, 0.95, 0.2],
  coffee: [-2.2, 0.95, 0.6],
  plant: [-2.2, 0.95, 1.0],

  // Right bakery & luxury rack (x = 2.2, y = 0.95)
  bread: [2.2, 0.95, -0.6],
  toycar: [2.2, 0.95, -0.2],
  cheese: [2.2, 0.95, 0.2],
  book: [2.2, 0.95, 0.6],
  watch: [2.2, 0.95, 1.0],

  // Back speciality & tech rack (z = -2.5, y = 1.45)
  flowers: [-0.8, 1.45, -2.5],
  headphones: [-0.4, 1.45, -2.5],
  sneakers: [0.0, 1.45, -2.5],
  sunglasses: [0.4, 1.45, -2.5],
  laptop: [0.8, 1.45, -2.5]
};

// Physical representation of products rendered on 3D Shelves based on stocked volumes
function ShelfProducts3D({ inventory }) {
  const productObjects = [];

  stockCatalogue.forEach((item) => {
    const qty = inventory[item.id] || 0;
    // Cap visual volume to 6 to balance luxury display and performance limits
    const renderQty = Math.min(6, qty);
    const basePos = SHELF_LOCATIONS[item.id];

    if (!basePos) return;

    for (let k = 0; k < renderQty; k++) {
      let finalPos;
      
      // Calculate coordinates depending on shelf orientation
      if (item.tierRequired === 3 || item.id === "flowers") {
        // Back wall shelf: stack upwards, depth layer along Z
        const yOffset = Math.floor(k / 2) * 0.14;
        const zOffset = (k % 2) * 0.12 - 0.06;
        finalPos = [basePos[0], basePos[1] + yOffset, basePos[2] + zOffset];
      } else {
        // Left/Right deep shelves: stack upwards, side-by-side along X
        const xOffset = (k % 2) * 0.18 - 0.09;
        const yOffset = Math.floor(k / 2) * 0.14;
        finalPos = [basePos[0] + xOffset, basePos[1] + yOffset, basePos[2]];
      }

      productObjects.push(
        <ShelfItem3D
          key={`${item.id}-${k}`}
          itemId={item.id}
          emoji={item.emoji}
          position={finalPos}
        />
      );
    }
  });

  return <group>{productObjects}</group>;
}

// Dynamic drone-style camera controller utilising continuous linear interpolation
function CameraController({ sequenceStep }) {
  // Instantiate a persistent lookAtTarget vector using useRef to avoid garbage collection overhead
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Define coordinate vectors for the two camera states using useMemo to avoid re-allocation
  const gameplayPos = useMemo(() => new THREE.Vector3(0, 5, 8), []);
  const gameplayTarget = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  const deskPos = useMemo(() => new THREE.Vector3(-1.5, 2.5, 0), []);
  const deskTarget = useMemo(() => new THREE.Vector3(-1.5, 1.2, -2), []);

  useFrame((state, delta) => {
    const { camera, controls } = state;
    // Delta-based interpolation factor to ensure smooth frame updates regardless of refresh rate
    const lerpFactor = Math.min(delta * 2.5, 1.0);

    if (sequenceStep === "playing") {
      // Re-enable and update OrbitControls target to align with the camera during gameplay
      if (controls) {
        controls.enabled = true;
        controls.target.lerp(gameplayTarget, lerpFactor);
        controls.update();
      }

      // Smoothly fly camera back to above the door perspective using explicit Vector3 lerping
      camera.position.lerp(gameplayPos, lerpFactor);
      lookAtTarget.current.lerp(gameplayTarget, lerpFactor);
    } else if (
      sequenceStep === "walkingToDesk" ||
      sequenceStep === "zooming" ||
      sequenceStep === "showingStats"
    ) {
      // Temporarily disable OrbitControls to let camera lerp freely as a drone follow camera
      if (controls) {
        controls.enabled = false;
      }

      // Smoothly transition camera behind shopkeeper to workstation monitor using explicit Vector3 lerping
      camera.position.lerp(deskPos, lerpFactor);
      lookAtTarget.current.lerp(deskTarget, lerpFactor);
    }

    // Execute camera.lookAt at the end of every frame to ensure smooth rotation as it flies
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}

export default function Shop3DWorld({ 
  inventory, 
  activeCustomer = null, 
  currentTier = 1, 
  isGoldenEmporium = false,
  isEndOfDay = false,
  onDeskReached = null,
  sequenceStep = "playing",
  neonSignTier = 0,
  marketingActive = false
}) {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#020408] z-0 select-none">
      <Canvas
        shadows
        camera={{ position: [0, 5, 8], fov: 50 }}
      >
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        {/* Warm spot lights for store boutique lighting */}
        <pointLight position={[-2, 2.5, 0]} intensity={1.2} color="#f59e0b" />
        <pointLight position={[2, 2.5, 0]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[0, 2.5, -2]} intensity={1.5} color="#ec4899" />
        {isGoldenEmporium && (
          <pointLight position={[0, 4, 0.5]} intensity={3.5} color="#fbbf24" distance={15} castShadow />
        )}

        {/* Camera Controller Zoom Module with sequenceStep prop */}
        <CameraController sequenceStep={sequenceStep} />

        {/* 1. FLOOR PLANE */}
        <Plane rotation={[-Math.PI / 2, 0, 0]} args={[30, 30]} receiveShadow>
          <meshStandardMaterial 
            color={isGoldenEmporium ? "#b45309" : "#451a03"} 
            roughness={isGoldenEmporium ? 0.15 : 0.95} 
            metalness={isGoldenEmporium ? 0.8 : 0.02} 
          />
        </Plane>

        {/* 2. BLOCKY MAIN COUNTER */}
        <group position={[0, 0.45, 0.5]}>
          {/* Base Counter box */}
          <Box args={[2.5, 0.9, 0.8]} castShadow receiveShadow>
            <meshStandardMaterial 
              color={isGoldenEmporium ? "#fbbf24" : (currentTier === 3 ? "gold" : "#7c2d12")} 
              roughness={isGoldenEmporium ? 0.1 : (currentTier === 3 ? 0.2 : 0.8)} 
              metalness={isGoldenEmporium ? 0.9 : (currentTier === 3 ? 0.8 : 0.0)} 
            />
          </Box>
          {/* Marble countertop surface box */}
          <Box args={[2.6, 0.08, 0.9]} position={[0, 0.48, 0]} castShadow>
            <meshStandardMaterial 
              color={isGoldenEmporium ? "#f59e0b" : (currentTier === 3 ? "gold" : "#f1f5f9")} 
              roughness={isGoldenEmporium ? 0.1 : (currentTier === 3 ? 0.2 : 0.15)} 
              metalness={isGoldenEmporium ? 0.9 : (currentTier === 3 ? 0.8 : 0.0)} 
            />
          </Box>
          {/* Register box */}
          <Box args={[0.4, 0.25, 0.35]} position={[-0.7, 0.6, 0]} castShadow>
            <meshStandardMaterial 
              color={isGoldenEmporium ? "#fbbf24" : "#334155"} 
              roughness={isGoldenEmporium ? 0.15 : 0.4} 
              metalness={isGoldenEmporium ? 0.95 : 0.0} 
            />
          </Box>
        </group>

        {/* 3. SHELVES */}
        {/* Produce Rack */}
        <group position={[-2.2, 0.4, 0.4]}>
          <Box args={[0.9, 0.8, 1.8]} castShadow receiveShadow>
            <meshStandardMaterial color={isGoldenEmporium ? "#78350f" : "#1e293b"} roughness={0.9} />
          </Box>
          <Box args={[1.0, 0.05, 1.9]} position={[0, 0.4, 0]} castShadow>
            <meshStandardMaterial color={isGoldenEmporium ? "#fbbf24" : "#ea580c"} roughness={0.7} />
          </Box>
        </group>
 
        {/* Bakery & Dairy Rack */}
        <group position={[2.2, 0.4, 0.4]}>
          <Box args={[0.9, 0.8, 1.8]} castShadow receiveShadow>
            <meshStandardMaterial color={isGoldenEmporium ? "#78350f" : "#1e293b"} roughness={0.9} />
          </Box>
          <Box args={[1.0, 0.05, 1.9]} position={[0, 0.4, 0]} castShadow>
            <meshStandardMaterial color={isGoldenEmporium ? "#fbbf24" : "#ea580c"} roughness={0.7} />
          </Box>
        </group>
 
        {/* Floral & Speciality Rack */}
        <group position={[0, 0.65, -2.5]}>
          <Box args={[2.2, 1.3, 0.6]} castShadow receiveShadow>
            <meshStandardMaterial color={isGoldenEmporium ? "#78350f" : "#0f172a"} roughness={0.8} />
          </Box>
          <Box args={[2.3, 0.05, 0.65]} position={[0, 0.65, 0]} castShadow>
            <meshStandardMaterial color={isGoldenEmporium ? "#fbbf24" : "#ea580c"} roughness={0.7} />
          </Box>
        </group>

        {/* 4. DETAILED COMPUTER DESK SETUP */}
        <group>
          {/* Mahogany Wooden Desk Table Box */}
          <Box args={[0.6, 0.65, 1.1]} position={[-1.7, 0.325, -1.5]} castShadow receiveShadow>
            <meshStandardMaterial color="#3e2723" roughness={0.85} />
          </Box>
          {/* Cozy Slate-Coloured Table Leg Frame */}
          <Box args={[0.08, 0.65, 1.1]} position={[-1.42, 0.325, -1.5]} castShadow>
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </Box>
          
          {/* Computer Monitor Case Box */}
          <Box args={[0.08, 0.35, 0.5]} position={[-1.68, 0.825, -1.5]} castShadow>
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
          </Box>
          {/* Glowing Green Screen Matrix (Stats Terminal Screen Decal) */}
          <Box args={[0.01, 0.3, 0.45]} position={[-1.63, 0.825, -1.5]} castShadow>
            <meshStandardMaterial 
              color="#22c55e" 
              emissive="#15803d" 
              emissiveIntensity={2.0} 
              roughness={0.15} 
            />
          </Box>
          {/* Heavy Slate Monitor Base Column */}
          <Box args={[0.15, 0.15, 0.15]} position={[-1.68, 0.675, -1.5]} castShadow>
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </Box>
        </group>

        {/* Active product meshes */}
        <ShelfProducts3D inventory={inventory} />

        {/* 3D Neon Sign Upgrade */}
        {neonSignTier > 0 && <NeonSign3D tier={neonSignTier} />}

        {/* 3D Marketing Campaign Poster (A-frame stand on the counter) */}
        {marketingActive && <MarketingPoster3D position={[0.7, 1.15, 0.5]} />}

        {/* Shopkeeper Stevie 🧑‍🍳 */}
        <Shopkeeper3D 
          isEndOfDay={isEndOfDay}
          onDeskReached={onDeskReached}
        />

        {/* Walking Customer Avatar */}
        {activeCustomer && (
          <Customer3D 
            key={activeCustomer.id} 
            customerData={activeCustomer} 
            isVIP={activeCustomer.isVIP} 
          />
        )}

        {/* Camera Orbit view angle parameters */}
        <OrbitControls 
          enableZoom={true} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={4} 
          maxDistance={12} 
        />
      </Canvas>
    </div>
  );
}
