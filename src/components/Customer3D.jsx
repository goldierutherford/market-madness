import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Decal, useTexture, Html } from "@react-three/drei";
import { generateFaceTexture } from "../utils/faceGenerator";
import { generateCustomerPhrase } from "../utils/phraseGenerator";

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

const ITEM_NAMES = {
  apple: "Crisp Gala Apple",
  cucumber: "Organic Cucumber",
  bread: "Artisan Sourdough Bread",
  watermelon: "Sweet Watermelon Slice",
  toycar: "Miniature Toy Car",
  cheese: "Mature Cheddar Cheese",
  flowers: "Spring Flower Bouquet",
  coffee: "Organic Coffee Beans",
  book: "Classic Fiction Book",
  plant: "Potted House Plant",
  headphones: "Wireless Headphones",
  watch: "Smart Fitness Watch",
  sneakers: "Premium Running Sneakers",
  sunglasses: "Designer Sunglasses",
  laptop: "Sleek Ultrabook Laptop"
};

const SKIN_TONES = [
  "#ffdbac", "#f1c27d", "#e0ac69", "#c68642", "#8d5524" 
];

const HAIR_COLOURS = [
  "#1e293b", // Slate Black
  "#78350f", // Warm Chestnut Brown
  "#ca8a04", // Mustard Blonde
  "#991b1b", // Red/Auburn
  "#475569", // Slate Grey
  "#db2777", // Hot Pink
  "#3b82f6", // Bright Blue
  "#22c55e"  // Neon Green
];

const HAIR_STYLES = [
  "puffy", "mohawk", "emo", "mullet", "spacebuns", "long", "crew", "spiky",
  "afro", "afro_mohawk", "punk_mohawk", "pigtails"
];

useTexture.preload(generateFaceTexture("neutral"));
useTexture.preload(generateFaceTexture("bargain"));
useTexture.preload(generateFaceTexture("acceptable"));
useTexture.preload(generateFaceTexture("expensive"));
useTexture.preload(generateFaceTexture("shopkeeper"));
useTexture.preload(generateFaceTexture("tongue"));

// Inline helper component to render complex geometric hairstyles
const HairGeometry = ({ style, colour }) => {
  switch (style) {
    case "mohawk":
      return (
        <group position={[0, 0.5, 0]}>
          {/* Shaved sides */}
          <mesh position={[0, 0.1, -0.05]}><sphereGeometry args={[0.26, 16, 16]} /><meshStandardMaterial color="#1e293b" roughness={0.9} /></mesh> 
          {/* Spikes */}
          <mesh position={[0, 0.35, 0.1]}><boxGeometry args={[0.06, 0.3, 0.15]}/><meshStandardMaterial color={colour}/></mesh>
          <mesh position={[0, 0.35, -0.05]}><boxGeometry args={[0.06, 0.3, 0.15]}/><meshStandardMaterial color={colour}/></mesh>
          <mesh position={[0, 0.3, -0.2]}><boxGeometry args={[0.06, 0.25, 0.15]}/><meshStandardMaterial color={colour}/></mesh>
        </group>
      );
    case "emo":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0.2, -0.1]}><sphereGeometry args={[0.26, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          {/* Swoop over the eye */}
          <mesh position={[0.12, 0.1, 0.22]} rotation={[0, 0, -0.6]}><boxGeometry args={[0.25, 0.35, 0.1]}/><meshStandardMaterial color={colour}/></mesh>
        </group>
      );
    case "mullet":
      return (
        <group position={[0, 0.5, 0]}>
          {/* Business in front */}
          <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.24, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          {/* Party in back */}
          <mesh position={[0, 0, -0.2]}><boxGeometry args={[0.4, 0.5, 0.15]}/><meshStandardMaterial color={colour}/></mesh>
        </group>
      );
    case "spacebuns":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0.2, -0.05]}><sphereGeometry args={[0.25, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          {/* Left and Right Buns */}
          <mesh position={[-0.2, 0.3, 0]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          <mesh position={[0.2, 0.3, 0]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
        </group>
      );
    case "long":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0.2, -0.05]}><sphereGeometry args={[0.26, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          {/* Long flow down back */}
          <mesh position={[0, -0.1, -0.15]}><boxGeometry args={[0.45, 0.7, 0.15]}/><meshStandardMaterial color={colour}/></mesh>
        </group>
      );
    case "crew":
      return (
        <group position={[0, 0.5, 0]}>
          {/* Short flat top */}
          <mesh position={[0, 0.22, -0.05]}><cylinderGeometry args={[0.24, 0.24, 0.1, 16]} /><meshStandardMaterial color={colour} /></mesh>
        </group>
      );
    case "spiky":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0.2, -0.05]}><sphereGeometry args={[0.24, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          {/* Angled anime cones */}
          <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshStandardMaterial color={colour} /></mesh>
          <mesh position={[-0.15, 0.3, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.08, 0.3, 8]} /><meshStandardMaterial color={colour} /></mesh>
          <mesh position={[0.15, 0.3, 0]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.08, 0.3, 8]} /><meshStandardMaterial color={colour} /></mesh>
          <mesh position={[0, 0.3, -0.15]} rotation={[0.5, 0, 0]}><coneGeometry args={[0.08, 0.3, 8]} /><meshStandardMaterial color={colour} /></mesh>
        </group>
      );
    case "afro":
      return (
        <group position={[0, 0.5, 0]}>
          {/* A large, beautiful, stylized afro dome */}
          <mesh position={[0, 0.22, -0.02]} castShadow>
            <sphereGeometry args={[0.34, 16, 16]} />
            <meshStandardMaterial color={colour} roughness={0.9} />
          </mesh>
        </group>
      );
    case "afro_mohawk":
      return (
        <group position={[0, 0.5, 0]}>
          {/* Shaved sides */}
          <mesh position={[0, 0.1, -0.05]}><sphereGeometry args={[0.26, 16, 16]} /><meshStandardMaterial color="#1e293b" roughness={0.9} /></mesh>
          {/* Super tall textured afro mohawk ridge */}
          <mesh position={[0, 0.35, 0.1]} castShadow><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color={colour} roughness={0.9} /></mesh>
          <mesh position={[0, 0.44, -0.05]} castShadow><sphereGeometry args={[0.17, 16, 16]} /><meshStandardMaterial color={colour} roughness={0.9} /></mesh>
          <mesh position={[0, 0.35, -0.2]} castShadow><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color={colour} roughness={0.9} /></mesh>
        </group>
      );
    case "punk_mohawk":
      return (
        <group position={[0, 0.5, 0]}>
          {/* Shaved sides */}
          <mesh position={[0, 0.1, -0.05]}><sphereGeometry args={[0.26, 16, 16]} /><meshStandardMaterial color="#1e293b" roughness={0.9} /></mesh>
          {/* Crazy tall, extreme punk spikes along center */}
          <mesh position={[0, 0.42, 0.12]} rotation={[0.2, 0, 0]} castShadow><coneGeometry args={[0.07, 0.45, 8]} /><meshStandardMaterial color={colour} roughness={0.6} /></mesh>
          <mesh position={[0, 0.48, -0.05]} rotation={[0, 0, 0]} castShadow><coneGeometry args={[0.08, 0.5, 8]} /><meshStandardMaterial color={colour} roughness={0.6} /></mesh>
          <mesh position={[0, 0.42, -0.22]} rotation={[-0.2, 0, 0]} castShadow><coneGeometry args={[0.07, 0.4, 8]} /><meshStandardMaterial color={colour} roughness={0.6} /></mesh>
        </group>
      );
    case "pigtails":
      return (
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0.2, -0.05]}><sphereGeometry args={[0.25, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          {/* Left Pigtail */}
          <group position={[-0.24, 0.22, -0.05]}>
            {/* Hair band */}
            <mesh><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#f43f5e" /></mesh>
            {/* Drooping ponytail */}
            <mesh position={[-0.08, -0.15, 0]} rotation={[0, 0, 0.6]}><coneGeometry args={[0.08, 0.3, 8]} /><meshStandardMaterial color={colour} /></mesh>
          </group>
          {/* Right Pigtail */}
          <group position={[0.24, 0.22, -0.05]}>
            {/* Hair band */}
            <mesh><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#f43f5e" /></mesh>
            {/* Drooping ponytail */}
            <mesh position={[0.08, -0.15, 0]} rotation={[0, 0, -0.6]}><coneGeometry args={[0.08, 0.3, 8]} /><meshStandardMaterial color={colour} /></mesh>
          </group>
        </group>
      );
    case "puffy":
    default:
      return (
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0.22, -0.05]}><sphereGeometry args={[0.22, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          <mesh position={[0, 0.0, -0.15]}><sphereGeometry args={[0.25, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          <mesh position={[-0.15, 0.1, -0.1]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
          <mesh position={[0.15, 0.1, -0.1]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color={colour} /></mesh>
        </group>
      );
  }
};

// Inline helper component to render deterministic facial hair
const FacialHair = ({ style, colour }) => {
  switch (style) {
    case "beard":
      return (
        <group position={[0, 0.5, 0]}>
          {/* Full stylized boxy beard wrapped around chin and jaw */}
          <mesh position={[0, -0.15, 0.15]} castShadow>
            <boxGeometry args={[0.34, 0.16, 0.18]} />
            <meshStandardMaterial color={colour} roughness={0.9} />
          </mesh>
          {/* Sideburn extensions */}
          <mesh position={[-0.15, -0.02, 0.05]} castShadow>
            <boxGeometry args={[0.06, 0.2, 0.1]} />
            <meshStandardMaterial color={colour} roughness={0.9} />
          </mesh>
          <mesh position={[0.15, -0.02, 0.05]} castShadow>
            <boxGeometry args={[0.06, 0.2, 0.1]} />
            <meshStandardMaterial color={colour} roughness={0.9} />
          </mesh>
        </group>
      );
    case "moustache":
      return (
        <group position={[0, 0.5, 0]}>
          {/* Classic quirky handlebar moustache under the nose */}
          <mesh position={[-0.06, -0.06, 0.26]} rotation={[0, 0, -0.15]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.05]} />
            <meshStandardMaterial color={colour} roughness={0.9} />
          </mesh>
          <mesh position={[0.06, -0.06, 0.26]} rotation={[0, 0, 0.15]} castShadow>
            <boxGeometry args={[0.12, 0.04, 0.05]} />
            <meshStandardMaterial color={colour} roughness={0.9} />
          </mesh>
        </group>
      );
    case "goatee":
      return (
        <group position={[0, 0.5, 0]}>
          {/* Dapper goatee chin puff */}
          <mesh position={[0, -0.18, 0.2]} castShadow>
            <boxGeometry args={[0.1, 0.12, 0.08]} />
            <meshStandardMaterial color={colour} roughness={0.9} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
};

export default function Customer3D({ 
  customerData, 
  isVIP, 
  reaction: propReaction, 
  itemName: propItemName,
  isStationary = false,
  isChild = false,
  isExtendedVisit = false,
  jokeState = null
}) {
  const groupRef = useRef();
  const innerGroupRef = useRef();
  const [startTime] = useState(() => Date.now());
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (isStationary) {
      setShowBubble(true);
      return;
    }
    const showTimeout = setTimeout(() => setShowBubble(true), 1500);
    const hideTimeout = setTimeout(() => setShowBubble(false), 6000);
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isStationary]);

  const customerId = customerData?.id || "default";
  const charCodeSum = customerId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  // Deterministic attribute selection
  const skinTone = SKIN_TONES[charCodeSum % SKIN_TONES.length];
  const hairColour = HAIR_COLOURS[(charCodeSum + 2) % HAIR_COLOURS.length];
  const hairStyle = HAIR_STYLES[(charCodeSum + 5) % HAIR_STYLES.length];

  // 40% chance of deterministic facial hair (using coprime modulos for ultimate variety)
  const hasFacialHair = (charCodeSum % 5) < 2;
  const facialHairStyle = ["beard", "moustache", "goatee"][charCodeSum % 3];

  const resolvedItemName = useMemo(() => {
    if (propItemName) return propItemName;
    return customerData?.itemId ? (ITEM_NAMES[customerData.itemId] || "goods") : "goods";
  }, [propItemName, customerData?.itemId]);

  const reaction = useMemo(() => propReaction || customerData?.reaction || "neutral", [propReaction, customerData?.reaction]);
  const finalIsVIP = !isChild && (isVIP || customerData?.isVIP || reaction === "VIP" || reaction === "vip");

  const phrase = useMemo(() => generateCustomerPhrase(reaction, resolvedItemName), [reaction, resolvedItemName]);

  const entrance = { x: 0, y: 0.6, z: 8.0 };
  const counter = { x: 0, y: 0.6, z: 1.6 };
  const exit = { x: 0, y: 0.6, z: 8.0 };

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (isStationary) {
      if (innerGroupRef.current) innerGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.03;
      return;
    }

    const elapsed = (Date.now() - startTime) / 1000;
    
    // Dynamic wait times
    const waitTime = isExtendedVisit ? 11.0 : 1.5; 
    const leaveStart = 1.5 + waitTime;

    const offsetX = isChild ? -0.8 : 0;
    const offsetY = isChild ? -0.15 : 0;

    let currentX = entrance.x + offsetX, currentZ = entrance.z, currentBob = 0, waddleAngle = 0;

    if (elapsed < 1.5) {
      const t = elapsed / 1.5;
      currentX = lerp(entrance.x, counter.x, t) + offsetX;
      currentZ = lerp(entrance.z, counter.z, t);
      currentBob = Math.abs(Math.sin(elapsed * 12)) * 0.15;
      waddleAngle = Math.sin(elapsed * 12) * 0.12;
    } else if (elapsed >= 1.5 && elapsed < leaveStart) {
      // PAUSED AT COUNTER
      currentX = counter.x + offsetX;
      currentZ = counter.z;
      currentBob = Math.sin(state.clock.elapsedTime * 4) * 0.03;
    } else if (elapsed >= leaveStart && elapsed < leaveStart + 3.0) {
      const t = (elapsed - leaveStart) / 3.0;
      currentX = lerp(counter.x, exit.x, t) + offsetX;
      currentZ = lerp(counter.z, exit.z, t);
      currentBob = Math.abs(Math.sin(elapsed * 12)) * 0.15;
      waddleAngle = Math.sin(elapsed * 12) * 0.12;
    } else {
      currentX = exit.x + offsetX;
      currentZ = exit.z;
    }

    groupRef.current.position.set(currentX, entrance.y + currentBob + offsetY, currentZ);
    const targetY = elapsed < leaveStart ? Math.PI : 0;
    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetY, 1 - Math.exp(-12 * Math.min(delta, 0.1)));
    if (innerGroupRef.current) innerGroupRef.current.rotation.z = waddleAngle;
  });

  let clothingColour = "#38bdf8";
  if (finalIsVIP) clothingColour = "#c084fc";
  else if (reaction === "bargain") clothingColour = "#f472b6";
  else if (reaction === "acceptable") clothingColour = "#22d3ee";
  else if (reaction === "expensive") clothingColour = "#f87171";

  const faceTextureUrl = useMemo(() => {
    if (reaction === "tongue") return generateFaceTexture("tongue");
    return finalIsVIP ? generateFaceTexture("bargain") : generateFaceTexture(reaction);
  }, [reaction, finalIsVIP]);
  const faceTexture = useTexture(faceTextureUrl);

  // 3. Immediately above the return statement, override the speech bubble:
  let displayPhrase = phrase;
  let forceBubble = showBubble;

  if (jokeState?.active) {
    forceBubble = false;
    if (!isChild && jokeState.phase === 1) { displayPhrase = "Go on, ask your question."; forceBubble = true; }
    else if (isChild && jokeState.phase === 2) { displayPhrase = jokeState.currentJoke?.setup; forceBubble = true; }
    else if (isChild && jokeState.phase === 4) { displayPhrase = jokeState.currentJoke?.punchline; forceBubble = true; }
    else if (!isChild && jokeState.phase === 5) { displayPhrase = "*sigh* Very funny. Let's go."; forceBubble = true; }
  }

  // 4. Ensure you scale down the child in the return block:
  const childScale = isChild ? 0.65 : 1;

  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      <group ref={innerGroupRef} scale={[childScale, childScale, childScale]}>
        
        {finalIsVIP && (
          <group position={[0, 0.72, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.03, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.28, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.04, 16]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.35, 0.7, 16]} />
          <meshStandardMaterial color={clothingColour} roughness={0.3} metalness={finalIsVIP ? 0.4 : 0.05} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
          
          <Decal position={[0, 0, 0.28]} rotation={[0, 0, 0]} scale={[0.36, 0.36, 0.36]}>
            <meshBasicMaterial map={faceTexture} transparent polygonOffset polygonOffsetFactor={-10} />
          </Decal>
        </mesh>

        {/* Deterministic Facial Hair */}
        {hasFacialHair && <FacialHair style={facialHairStyle} colour={hairColour} />}

        {/* Dynamic Hair Geometry */}
        <HairGeometry style={hairStyle} colour={hairColour} />

        {/* Limbs */}
        <mesh position={[-0.26, 0.1, 0]} rotation={[0, 0, 0.15]} castShadow>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color={clothingColour} roughness={0.4} />
        </mesh>
        <mesh position={[0.26, 0.1, 0]} rotation={[0, 0, -0.15]} castShadow>
          <capsuleGeometry args={[0.07, 0.22, 8, 16]} />
          <meshStandardMaterial color={clothingColour} roughness={0.4} />
        </mesh>
      </group>

      {forceBubble && displayPhrase && (
        <Html position={[0, 2.5, 0]} center distanceFactor={7}>
          <style>{`
            @keyframes bubblePop {
              0% { transform: scale(0.6) translateY(10px); opacity: 0; }
              70% { transform: scale(1.1) translateY(-2px); opacity: 1; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            .bubble-pop-anim {
              animation: bubblePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>
          <div className="bubble-pop-anim relative bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-100 w-36 font-bold text-center text-[11px] leading-normal select-none">
            "{displayPhrase}"
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
          </div>
        </Html>
      )}
    </group>
  );
}
