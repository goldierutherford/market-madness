import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Decal, useTexture, Html } from "@react-three/drei";
import { generateFaceTexture } from "../utils/faceGenerator";

// Linear interpolation utility
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

// A palette of warm, varied skin tones for a cartoony chibi representation
const SKIN_TONES = [
  "#ffdbac", // Pale skin
  "#f1c27d", // Peach skin
  "#e0ac69", // Golden/tan skin
  "#c68642", // Medium brown skin
  "#8d5524"  // Deep brown skin
];

// Hair colour palette
const HAIR_COLOURS = [
  "#1e293b", // Slate Black
  "#78350f", // Warm Chestnut Brown
  "#ca8a04", // Mustard Blonde
  "#991b1b", // Red/Auburn
  "#475569"  // Slate Grey
];

// Pre-load all face textures globally to prevent Suspense unmounting / blinking during reaction changes
useTexture.preload(generateFaceTexture("neutral"));
useTexture.preload(generateFaceTexture("bargain"));
useTexture.preload(generateFaceTexture("acceptable"));
useTexture.preload(generateFaceTexture("expensive"));
useTexture.preload(generateFaceTexture("shopkeeper"));

export default function Customer3D({ customerData, isVIP }) {
  const groupRef = useRef();
  const innerGroupRef = useRef();
  const [startTime] = useState(() => Date.now());

  // Determine skin tone and hair colour deterministically based on customer data or VIP status
  const customerId = customerData?.id || "default";
  const charCodeSum = customerId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const skinTone = SKIN_TONES[charCodeSum % SKIN_TONES.length];
  const hairColour = HAIR_COLOURS[(charCodeSum + 2) % HAIR_COLOURS.length];

  // Set up shop entrance/exit path coordinates (waddling along the Z-axis)
  const entrance = { x: 0, y: 0.6, z: 8.0 }; // Spawn foreground, facing away
  const counter = { x: 0, y: 0.6, z: 1.6 }; // Standing point in front of register
  const exit = { x: 0, y: 0.6, z: 8.0 }; // Exit back toward the camera/foreground

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = (Date.now() - startTime) / 1000; // time in seconds
    let currentX = entrance.x;
    let currentZ = entrance.z;
    let currentBob = 0;
    let waddleAngle = 0;

    // 1. Z-Axis Position Translation Phases (Optimised for 6.0s total cycle)
    if (elapsed < 1.5) {
      // Phase 1 (Walk In): 0.0s to 1.5s. Spawn at Z=8.0, walk to counter Z=1.6
      const t = elapsed / 1.5;
      currentX = lerp(entrance.x, counter.x, t);
      currentZ = lerp(entrance.z, counter.z, t);
      currentBob = Math.abs(Math.sin(elapsed * 12)) * 0.15; // bouncy step bob
      waddleAngle = Math.sin(elapsed * 12) * 0.12; // cute waddle waddle
    } else if (elapsed >= 1.5 && elapsed < 3.0) {
      // Phase 2 (Transaction): 1.5s to 3.0s. Paused at counter.
      currentX = counter.x;
      currentZ = counter.z;
      currentBob = Math.sin(state.clock.elapsedTime * 4) * 0.03; // soft stand breathing bob
      waddleAngle = 0;
    } else if (elapsed >= 3.0 && elapsed < 6.0) {
      // Phase 3 (Turn & Exit): 3.0s to 6.0s. Turn to face camera and walk back to Z=8.0
      const t = (elapsed - 3.0) / 3.0;
      currentX = lerp(counter.x, exit.x, t);
      currentZ = lerp(counter.z, exit.z, t);
      currentBob = Math.abs(Math.sin(elapsed * 12)) * 0.15; // walking bob
      waddleAngle = Math.sin(elapsed * 12) * 0.12; // cute waddle waddle
    } else {
      // Phase 4 (Off-stage): 6.0s+
      currentX = exit.x;
      currentZ = exit.z;
      waddleAngle = 0;
    }

    // Set position directly on the group ref for high performance (no React re-renders)
    groupRef.current.position.set(currentX, entrance.y + currentBob, currentZ);

    // 2. Cinematic Rotation Turnaround Logic
    // - Phase 1 & 2: Face away from camera (Math.PI) looking at Stevie
    // - Phase 3 & 4: Spin to face camera (0) to reveal custom decal reactions
    const targetY = elapsed < 3.0 ? Math.PI : 0;
    
    // Frame-rate independent exponential interpolation for a smooth 0.3s turnaround
    const safeDelta = Math.min(delta, 0.1);
    groupRef.current.rotation.y = lerp(
      groupRef.current.rotation.y,
      targetY,
      1 - Math.exp(-12 * safeDelta)
    );

    // Apply the cute waddle rotation strictly to the inner visual group Z-axis
    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.z = waddleAngle;
    }
  });


  const reaction = customerData?.reaction || "neutral";
  const finalIsVIP = isVIP || customerData?.isVIP || reaction === "VIP";

  // Dynamic SVG face texture select and styling setup based on reactions
  let clothingColour = "#38bdf8"; // default blue shirt
  let bubbleBg = "bg-slate-900 border-slate-700 text-slate-100";
  let reactEmoji = "😊";

  if (finalIsVIP) {
    clothingColour = "#c084fc"; // Royal purple clothing
    bubbleBg = "bg-amber-950/95 border-amber-400 text-amber-200 shadow-amber-400/20 font-black";
    reactEmoji = "👑";
  } else if (reaction === "bargain") {
    clothingColour = "#f472b6"; // Warm pink shirt
    bubbleBg = "bg-pink-900/95 border-pink-500 text-white shadow-pink-500/20";
    reactEmoji = "😍";
  } else if (reaction === "acceptable") {
    clothingColour = "#22d3ee"; // Cyan shirt
    bubbleBg = "bg-cyan-900/95 border-cyan-500 text-white shadow-cyan-500/20";
    reactEmoji = "😊";
  } else if (reaction === "expensive") {
    clothingColour = "#f87171"; // Coral red shirt
    bubbleBg = "bg-red-900/95 border-red-500 text-white shadow-red-500/20";
    reactEmoji = "😠";
  }

  // Load the pre-cached base64 SVG texture dynamically based on reaction state
  const faceTextureUrl = useMemo(() => {
    if (finalIsVIP) return generateFaceTexture("bargain"); // VIPs share the sparkle bargain face
    return generateFaceTexture(reaction);
  }, [reaction, finalIsVIP]);

  const faceTexture = useTexture(faceTextureUrl);

  return (
    // Initialize facing the counter (Math.PI) to match starting waddling state
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      {/* Inner Waddling Group (separates position translation from waddle rotation) */}
      <group ref={innerGroupRef}>
        
        {/* VIP Top Hat Cylinder */}
        {finalIsVIP && (
          <group position={[0, 0.72, 0]}>
            {/* Hat Brim */}
            <mesh castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.03, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            {/* Hat Crown */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.28, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            {/* Gold ribbon around hat */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.04, 16]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* 1. Body (Clothing): A slightly tapered Cylinder with soft edges (Chibi style) */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.35, 0.7, 16]} />
          <meshStandardMaterial 
            color={clothingColour} 
            roughness={0.3} 
            metalness={finalIsVIP ? 0.4 : 0.05} 
          />
        </mesh>

        {/* 2. Head: A perfect Sphere sitting on the body, holding the Face Decal */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
          
          {/* High-quality UV-projected SVG Decal face */}
          <Decal
            position={[0, 0, 0.28]} // local translation relative to sphere center, projects forward (+Z)
            rotation={[0, 0, 0]}
            scale={[0.36, 0.36, 0.36]} // size of features on head
          >
            <meshBasicMaterial
              map={faceTexture}
              transparent
              polygonOffset
              polygonOffsetFactor={-10} // absolute overlay projection to prevent z-fighting / stitching
            />
          </Decal>
        </mesh>

        {/* 3. Hair: A cluster of overlapping Sphere geometries (Puffy cartoon hair) */}
        <group position={[0, 0.5, 0]}>
          {/* Top Hair Puff */}
          <mesh position={[0, 0.22, -0.05]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color={hairColour} roughness={0.6} />
          </mesh>
          {/* Back Hair Puff */}
          <mesh position={[0, 0.0, -0.15]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color={hairColour} roughness={0.6} />
          </mesh>
          {/* Left Hair Puff */}
          <mesh position={[-0.15, 0.1, -0.1]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={hairColour} roughness={0.6} />
          </mesh>
          {/* Right Hair Puff */}
          <mesh position={[0.15, 0.1, -0.1]} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={hairColour} roughness={0.6} />
          </mesh>
        </group>

        {/* 4. Limbs: Tiny Capsule geometries for arms resting at the sides */}
        {/* Left Arm */}
        <mesh position={[-0.26, 0.1, 0]} rotation={[0, 0, 0.15]} castShadow>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color={clothingColour} roughness={0.4} />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.26, 0.1, 0]} rotation={[0, 0, -0.15]} castShadow>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color={clothingColour} roughness={0.4} />
        </mesh>

      </group>

      {/* Floating HTML Speech Bubble displaying reactive feedback descriptions */}
      {customerData && (
        <Html position={[0, 1.25, 0]} center distanceFactor={7}>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-2xl text-[10px] font-bold select-none whitespace-nowrap transition-all duration-300 transform scale-110 ${bubbleBg}`}>
            <span className="text-sm">{reactEmoji}</span>
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-extrabold tracking-wider font-mono opacity-80 uppercase leading-none">Customer</span>
              <span className="mt-0.5 max-w-[125px] overflow-hidden text-ellipsis whitespace-nowrap">"{customerData.text}"</span>
            </div>
            <span className="bg-black/40 px-1 rounded text-[9px]">{customerData.itemEmoji}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
