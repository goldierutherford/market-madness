import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Decal, useTexture, Html } from "@react-three/drei";
import { generateFaceTexture } from "../utils/faceGenerator";

// Pre-load the acceptable face texture globally to prevent Suspense unmounting / blinking
useTexture.preload(generateFaceTexture("acceptable"));

export default function Teller3D({ dialogue = null }) {
  const bodyRef = useRef();

  // Load the pre-cached polite professional smile face texture
  const tellerFace = useTexture(generateFaceTexture("acceptable"));

  // Soft breathing idle animation for the bank teller
  useFrame((state) => {
    if (bodyRef.current) {
      const breathingWave = Math.sin(state.clock.elapsedTime * 2.2);
      bodyRef.current.scale.y = 1 + breathingWave * 0.02; // 2% expansion
      bodyRef.current.scale.x = 1 - breathingWave * 0.006;
      bodyRef.current.scale.z = 1 - breathingWave * 0.006;
      bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03; // very gentle side to side turning
    }
  });

  return (
    <group position={[0, 0.65, 0]}>
      {/* Visual group representing the Bank Teller with breathing animations */}
      <group ref={bodyRef}>
        
        {/* 1. Body (Clothing): A tapered cylinder representing a professional suit */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.35, 0.7, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} /> {/* Professional Dark Slate Suit */}
        </mesh>

        {/* Shirt Collar Detail */}
        <mesh position={[0, 0.25, 0.15]} castShadow>
          <boxGeometry args={[0.13, 0.1, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} /> {/* White shirt collar */}
        </mesh>

        {/* Red Necktie Detail */}
        <mesh position={[0, 0.1, 0.16]} castShadow>
          <boxGeometry args={[0.04, 0.2, 0.06]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} /> {/* Bright Red Necktie */}
        </mesh>

        {/* 2. Head: A perfect skin-tone Sphere holding the Face Decal */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#f1d2a3" roughness={0.5} /> {/* Polite Banker Skin Tone */}
          
          {/* Custom SVG Face Decal with polite arches eyes and a sweet smile */}
          <Decal
            position={[0, 0, 0.28]}
            rotation={[0, 0, 0]}
            scale={[0.36, 0.36, 0.36]}
          >
            <meshBasicMaterial
              map={tellerFace}
              transparent
              polygonOffset
              polygonOffsetFactor={-10}
            />
          </Decal>
        </mesh>

        {/* 3. Hair: Overlapping spheres representing a clean, professional haircut */}
        <group position={[0, 0.5, 0]}>
          {/* Top Hair Volume */}
          <mesh position={[0, 0.26, -0.04]} castShadow>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} /> {/* Professional Dark Brown Hair */}
          </mesh>
          {/* Back/Low Hair */}
          <mesh position={[0, 0.1, -0.12]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          {/* Left Fringe/Side Part */}
          <mesh position={[-0.15, 0.22, 0.1]} castShadow>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          {/* Right Fringe/Side Part */}
          <mesh position={[0.15, 0.22, 0.1]} castShadow>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
        </group>

        {/* 4. Limbs: Tiny sleeves resting at the sides */}
        {/* Left Arm sleeve */}
        <mesh position={[-0.26, 0.05, 0]} rotation={[0, 0, 0.12]} castShadow>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Right Arm sleeve */}
        <mesh position={[0.26, 0.05, 0]} rotation={[0, 0, -0.12]} castShadow>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>

      </group>

      {/* Floating HTML Signage badge */}
      <Html position={[0, 1.2, 0]} center distanceFactor={8}>
        <div className="bg-slate-950/90 border border-amber-500/40 text-amber-400 text-[8px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-widest whitespace-nowrap select-none pointer-events-none">
          Vault Teller 🏦
        </div>
      </Html>

      {/* Cartoony Speech Bubble for dialogue sequence */}
      {dialogue && (
        <Html position={[0, 2.5, 0]} center distanceFactor={8}>
          <style>{`
            @keyframes tellerPop {
              0% { transform: scale(0.6) translateY(10px); opacity: 0; }
              70% { transform: scale(1.1) translateY(-2px); opacity: 1; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            .teller-bubble-anim {
              animation: tellerPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>
          <div className="teller-bubble-anim relative bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-100 w-36 font-bold text-center text-[11px] leading-normal select-none">
            "{dialogue}"
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
          </div>
        </Html>
      )}

    </group>
  );
}
