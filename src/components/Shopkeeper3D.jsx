import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Decal, useTexture, Html } from "@react-three/drei";
import { generateFaceTexture } from "../utils/faceGenerator";
import { MathUtils } from "three";

// Pre-load the shopkeeper face texture globally to prevent Suspense unmounting / blinking
useTexture.preload(generateFaceTexture("shopkeeper"));

export default function Shopkeeper3D({ 
  isEndOfDay = false, 
  onDeskReached, 
  dialogue = null 
}) {
  const groupRef = useRef();
  const bodyRef = useRef();

  // Load the pre-cached base64 SVG texture representing Chef Stevie's mustache & blushing face
  const shopkeeperFace = useTexture(generateFaceTexture("shopkeeper"));

  // Track if we have already triggered the onDeskReached callback
  const callbackTriggered = useRef(false);

  // Keep track of internal rotation and position
  const currentPos = useRef([0, 0.65, -0.6]);
  const currentRotY = useRef(0);

  useFrame((state, delta) => {
    // Stevie walks behind the counter to the left desk station
    const targetPos = isEndOfDay ? [-1.2, 0.45, -1.5] : [0, 0.65, -0.6];
    const targetRotY = isEndOfDay ? -Math.PI / 2 : 0;

    // Linear interpolation using MathUtils.lerp
    const lerpSpeed = Math.min(delta * 4.0, 1.0);
    currentPos.current[0] = MathUtils.lerp(currentPos.current[0], targetPos[0], lerpSpeed);
    currentPos.current[1] = MathUtils.lerp(currentPos.current[1], targetPos[1], lerpSpeed);
    currentPos.current[2] = MathUtils.lerp(currentPos.current[2], targetPos[2], lerpSpeed);
    
    currentRotY.current = MathUtils.lerp(currentRotY.current, targetRotY, lerpSpeed);

    if (groupRef.current) {
      groupRef.current.position.set(currentPos.current[0], currentPos.current[1], currentPos.current[2]);
      groupRef.current.rotation.y = currentRotY.current;
    }

    const isSitting = isEndOfDay && Math.abs(currentPos.current[0] - targetPos[0]) < 0.05;

    if (isEndOfDay) {
      if (isSitting && !callbackTriggered.current) {
        callbackTriggered.current = true;
        if (onDeskReached) {
          onDeskReached();
        }
      }
    } else {
      callbackTriggered.current = false;
    }

    if (bodyRef.current) {
      if (!isSitting) {
        // Gentle breathing idle cycle (bobs height slightly up and down)
        const breathingWave = Math.sin(state.clock.elapsedTime * 2.8);
        bodyRef.current.scale.y = 1 + breathingWave * 0.025; // 2.5% expansion
        bodyRef.current.scale.x = 1 - breathingWave * 0.008; // subtle side-breathe counteraction
        bodyRef.current.scale.z = 1 - breathingWave * 0.008; // subtle depth-breathe counteraction
        
        // Gentle shoulder twist
        bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
      } else {
        // Halt breathing animation in sitting pose
        bodyRef.current.scale.set(1, 1, 1);
        bodyRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.65, -0.6]}>
      
      {/* Visual group representing Stevie the Shopkeeper with breathing animations */}
      <group ref={bodyRef}>
        
        {/* 1. Body (Clothing): A slightly tapered blue cylinder for his shirt */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.35, 0.7, 16]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.4} /> {/* Cozy Royal Blue Shirt */}
        </mesh>
        
        {/* White Fabric Apron Overlay on the front half */}
        <mesh position={[0, -0.1, 0.16]} castShadow>
          <boxGeometry args={[0.31, 0.45, 0.06]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} /> {/* Crisp White Apron */}
        </mesh>

        {/* 2. Head: A perfect skin-tone Sphere holding the Face Decal */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#f1c27d" roughness={0.5} /> {/* Warm Cozy Skin Tone */}
          
          {/* Custom SVG Face Decal with rosy blush, happy arch eyes, and chef mustache */}
          <Decal
            position={[0, 0, 0.28]} // local translation relative to sphere center, projects forward (+Z)
            rotation={[0, 0, 0]}
            scale={[0.36, 0.36, 0.36]} // size of features on head
          >
            <meshBasicMaterial
              map={shopkeeperFace}
              transparent
              polygonOffset
              polygonOffsetFactor={-10} // absolute overlay projection to prevent z-fighting / stitching
            />
          </Decal>
        </mesh>

        {/* 3. Chef's Hat: Puffy soft hat made of a cylinder base + 3 overlapping spheres */}
        <group position={[0, 0.5, 0]}>
          {/* Hat Cylinder Base */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Puffy Fabric Sphere 1 (Center) */}
          <mesh position={[0, 0.4, 0.02]} castShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Puffy Fabric Sphere 2 (Left) */}
          <mesh position={[-0.08, 0.43, -0.04]} castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Puffy Fabric Sphere 3 (Right) */}
          <mesh position={[0.08, 0.43, -0.04]} castShadow>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
        </group>

        {/* 4. Limbs: Tiny capsule sleeves/arms resting at the sides */}
        {/* Left Arm */}
        <mesh position={[-0.26, 0.05, 0]} rotation={[0, 0, 0.12]} castShadow>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.4} />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.26, 0.05, 0]} rotation={[0, 0, -0.12]} castShadow>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.4} />
        </mesh>

      </group>
      
      {/* Floating HTML Signage badge */}
      <Html position={[0, 1.25, 0]} center distanceFactor={8}>
        <div className="bg-slate-950/80 border border-blue-500/40 text-blue-400 text-[8px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-widest whitespace-nowrap select-none pointer-events-none">
          Stevie 🧑‍🍳
        </div>
      </Html>

      {/* Cartoony Speech Bubble for dialogue sequence */}
      {dialogue && (
        <Html position={[0, 2.5, 0]} center distanceFactor={8}>
          <style>{`
            @keyframes shopkeeperPop {
              0% { transform: scale(0.6) translateY(10px); opacity: 0; }
              70% { transform: scale(1.1) translateY(-2px); opacity: 1; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            .sk-bubble-anim {
              animation: shopkeeperPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>
          <div className="sk-bubble-anim relative bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-100 w-36 font-bold text-center text-[11px] leading-normal select-none">
            "{dialogue}"
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
          </div>
        </Html>
      )}

    </group>
  );
}
